using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Sales;
using MediRaksha.Application.Interfaces;
using MediRaksha.Domain.Entities;
using MediRaksha.Shared.Models;

namespace MediRaksha.Infrastructure.Services
{
    public class SaleService : ISaleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SaleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<IReadOnlyList<SaleDto>>> GetAllAsync()
        {
            var saleRepo = _unitOfWork.Repository<Sale>();
            var userRepo = _unitOfWork.Repository<User>();

            var sales = await saleRepo.GetAllAsync();
            var dtos = new List<SaleDto>();

            foreach (var sale in sales)
            {
                var user = await userRepo.GetByIdAsync(sale.CreatedByUserId);

                dtos.Add(new SaleDto
                {
                    Id = sale.Id,
                    InvoiceNumber = sale.InvoiceNumber,
                    SaleDate = sale.SaleDate,
                    CustomerName = sale.CustomerName,
                    CustomerPhone = sale.CustomerPhone,
                    DoctorName = sale.DoctorName,
                    TotalAmount = sale.TotalAmount,
                    DiscountAmount = sale.DiscountAmount,
                    TaxAmount = sale.TaxAmount,
                    NetAmount = sale.NetAmount,
                    PaymentMode = sale.PaymentMode,
                    Status = sale.Status,
                    CreatedByUserName = user != null ? user.FullName : "Unknown"
                });
            }

            return ApiResponse<IReadOnlyList<SaleDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<SaleDto>> GetByIdAsync(Guid id)
        {
            var saleRepo = _unitOfWork.Repository<Sale>();
            var sale = await saleRepo.GetByIdAsync(id);

            if (sale == null)
            {
                return ApiResponse<SaleDto>.ErrorResponse("Sale not found");
            }

            var userRepo = _unitOfWork.Repository<User>();
            var saleItemRepo = _unitOfWork.Repository<SaleItem>();
            var batchRepo = _unitOfWork.Repository<InventoryBatch>();
            var medicineRepo = _unitOfWork.Repository<Medicine>();

            var user = await userRepo.GetByIdAsync(sale.CreatedByUserId);
            var saleItems = await saleItemRepo.GetAsync(si => si.SaleId == sale.Id);

            var itemDtos = new List<SaleItemDto>();
            foreach (var item in saleItems)
            {
                var medicine = await medicineRepo.GetByIdAsync(item.MedicineId);
                var batch = await batchRepo.GetByIdAsync(item.BatchId);

                itemDtos.Add(new SaleItemDto
                {
                    MedicineId = item.MedicineId,
                    MedicineName = medicine?.Name ?? "Unknown",
                    BatchNumber = batch?.BatchNumber ?? "Unknown",
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    MRP = item.MRP,
                    DiscountPercentage = item.DiscountPercentage,
                    TaxPercentage = item.TaxPercentage,
                    TotalAmount = item.TotalAmount
                });
            }

            var dto = new SaleDto
            {
                Id = sale.Id,
                InvoiceNumber = sale.InvoiceNumber,
                SaleDate = sale.SaleDate,
                CustomerName = sale.CustomerName,
                CustomerPhone = sale.CustomerPhone,
                DoctorName = sale.DoctorName,
                TotalAmount = sale.TotalAmount,
                DiscountAmount = sale.DiscountAmount,
                TaxAmount = sale.TaxAmount,
                NetAmount = sale.NetAmount,
                PaymentMode = sale.PaymentMode,
                Status = sale.Status,
                CreatedByUserName = user != null ? user.FullName : "Unknown",
                Items = itemDtos
            };

            return ApiResponse<SaleDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<SaleDto>> CreateAsync(CreateSaleRequest request, Guid currentUserId)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return ApiResponse<SaleDto>.ErrorResponse("Sale must have at least one item.");
            }

            var batchRepo = _unitOfWork.Repository<InventoryBatch>();
            var medicineRepo = _unitOfWork.Repository<Medicine>();
            
            var saleItems = new List<SaleItem>();
            decimal subtotal = 0;
            decimal totalTax = 0;

            foreach (var itemReq in request.Items)
            {
                var batch = await batchRepo.GetByIdAsync(itemReq.BatchId);
                if (batch == null || batch.AvailableQuantity < itemReq.Quantity)
                {
                    return ApiResponse<SaleDto>.ErrorResponse($"Insufficient stock or invalid batch for item.");
                }

                var medicine = await medicineRepo.GetByIdAsync(itemReq.MedicineId);
                
                // Calculate item total
                decimal itemTotal = itemReq.Quantity * batch.SellingPrice;
                decimal itemDiscount = itemTotal * (itemReq.DiscountPercentage / 100);
                decimal taxableAmount = itemTotal - itemDiscount;
                decimal itemTax = taxableAmount * (batch.TaxPercentage / 100);

                saleItems.Add(new SaleItem
                {
                    MedicineId = itemReq.MedicineId,
                    BatchId = itemReq.BatchId,
                    Quantity = itemReq.Quantity,
                    UnitPrice = batch.SellingPrice,
                    MRP = batch.MRP,
                    DiscountPercentage = itemReq.DiscountPercentage,
                    TaxPercentage = batch.TaxPercentage,
                    TotalAmount = taxableAmount + itemTax
                });

                subtotal += taxableAmount;
                totalTax += itemTax;

                // Update Stock
                batch.AvailableQuantity -= itemReq.Quantity;
                await batchRepo.UpdateAsync(batch);
            }

            var sale = new Sale
            {
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}",
                SaleDate = DateTime.UtcNow,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                DoctorName = request.DoctorName,
                TotalAmount = subtotal,
                DiscountAmount = request.DiscountAmount,
                TaxAmount = totalTax,
                NetAmount = subtotal + totalTax - request.DiscountAmount,
                PaymentMode = request.PaymentMode,
                Status = "Completed",
                CreatedByUserId = currentUserId,
                SaleItems = saleItems
            };

            var saleRepo = _unitOfWork.Repository<Sale>();
            await saleRepo.AddAsync(sale);
            await _unitOfWork.CompleteAsync();

            return await GetByIdAsync(sale.Id);
        }

        public async Task<ApiResponse<byte[]>> GenerateInvoicePdfAsync(Guid saleId)
        {
            // Implementation for PDF generation (Placeholder for now)
            return ApiResponse<byte[]>.SuccessResponse(new byte[0]);
        }
    }
}
