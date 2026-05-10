using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.InventoryBatches;
using MediRaksha.Application.Interfaces;
using MediRaksha.Domain.Entities;
using MediRaksha.Shared.Models;

namespace MediRaksha.Infrastructure.Services
{
    public class InventoryBatchService : IInventoryBatchService
    {
        private readonly IUnitOfWork _unitOfWork;

        public InventoryBatchService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<IReadOnlyList<InventoryBatchDto>>> GetAllAsync()
        {
            var batchRepo = _unitOfWork.Repository<InventoryBatch>();
            var medicineRepo = _unitOfWork.Repository<Medicine>();

            var batches = await batchRepo.GetAllAsync();
            var dtos = new List<InventoryBatchDto>();

            foreach (var batch in batches)
            {
                var medicine = await medicineRepo.GetByIdAsync(batch.MedicineId);
                
                dtos.Add(new InventoryBatchDto
                {
                    Id = batch.Id,
                    MedicineId = batch.MedicineId,
                    MedicineName = medicine?.Name ?? "Unknown",
                    BatchNumber = batch.BatchNumber,
                    ExpiryDate = batch.ExpiryDate,
                    Quantity = batch.Quantity,
                    AvailableQuantity = batch.AvailableQuantity,
                    PurchasePrice = batch.PurchasePrice,
                    SellingPrice = batch.SellingPrice,
                    MRP = batch.MRP,
                    TaxPercentage = batch.TaxPercentage,
                    IsActive = batch.IsActive
                });
            }

            return ApiResponse<IReadOnlyList<InventoryBatchDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<InventoryBatchDto>> CreateAsync(CreateInventoryBatchRequest request)
        {
            var batchRepo = _unitOfWork.Repository<InventoryBatch>();
            var medicineRepo = _unitOfWork.Repository<Medicine>();

            var medicine = await medicineRepo.GetByIdAsync(request.MedicineId);
            if (medicine == null)
            {
                return ApiResponse<InventoryBatchDto>.ErrorResponse("Medicine not found.");
            }

            var batch = new InventoryBatch
            {
                MedicineId = request.MedicineId,
                BatchNumber = request.BatchNumber,
                ExpiryDate = request.ExpiryDate,
                Quantity = request.Quantity,
                AvailableQuantity = request.Quantity, // Initially, available equals total quantity
                PurchasePrice = request.PurchasePrice,
                SellingPrice = request.SellingPrice,
                MRP = request.MRP,
                TaxPercentage = request.TaxPercentage,
                IsActive = true
            };

            await batchRepo.AddAsync(batch);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<InventoryBatchDto>.SuccessResponse(new InventoryBatchDto
            {
                Id = batch.Id,
                MedicineId = batch.MedicineId,
                MedicineName = medicine.Name,
                BatchNumber = batch.BatchNumber,
                ExpiryDate = batch.ExpiryDate,
                Quantity = batch.Quantity,
                AvailableQuantity = batch.AvailableQuantity,
                PurchasePrice = batch.PurchasePrice,
                SellingPrice = batch.SellingPrice,
                MRP = batch.MRP,
                TaxPercentage = batch.TaxPercentage,
                IsActive = batch.IsActive
            });
        }
        public async Task<ApiResponse<IReadOnlyList<InventoryBatchDto>>> GetByMedicineIdAsync(Guid medicineId)
        {
            var batches = await _unitOfWork.Repository<InventoryBatch>().GetAsync(b => b.MedicineId == medicineId || medicineId == Guid.Empty);
            var dtos = new List<InventoryBatchDto>();
            var medicineRepo = _unitOfWork.Repository<Medicine>();

            foreach (var batch in batches)
            {
                var medicine = await medicineRepo.GetByIdAsync(batch.MedicineId);
                dtos.Add(new InventoryBatchDto
                {
                    Id = batch.Id,
                    MedicineId = batch.MedicineId,
                    MedicineName = medicine?.Name ?? "Unknown",
                    BatchNumber = batch.BatchNumber,
                    ExpiryDate = batch.ExpiryDate,
                    Quantity = batch.Quantity,
                    AvailableQuantity = batch.AvailableQuantity,
                    PurchasePrice = batch.PurchasePrice,
                    SellingPrice = batch.SellingPrice,
                    MRP = batch.MRP,
                    TaxPercentage = batch.TaxPercentage,
                    IsActive = batch.IsActive
                });
            }

            return ApiResponse<IReadOnlyList<InventoryBatchDto>>.SuccessResponse(dtos);
        }
    }
}
