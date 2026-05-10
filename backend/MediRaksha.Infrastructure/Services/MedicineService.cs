using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Medicines;
using MediRaksha.Application.Interfaces;
using MediRaksha.Domain.Entities;
using MediRaksha.Shared.Models;

namespace MediRaksha.Infrastructure.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MedicineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<IReadOnlyList<MedicineDto>>> GetAllAsync()
        {
            var medicines = await _unitOfWork.Repository<Medicine>().GetAllAsync();
            var dtos = await MapToDtos(medicines);
            return ApiResponse<IReadOnlyList<MedicineDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<MedicineDto>> GetByIdAsync(Guid id)
        {
            var medicine = await _unitOfWork.Repository<Medicine>().GetByIdAsync(id);
            if (medicine == null) return ApiResponse<MedicineDto>.ErrorResponse("Medicine not found");
            
            var dtos = await MapToDtos(new[] { medicine });
            return ApiResponse<MedicineDto>.SuccessResponse(dtos.First());
        }

        public async Task<ApiResponse<MedicineDto>> CreateAsync(CreateMedicineRequest request)
        {
            var medicine = new Medicine
            {
                Name = request.Name,
                GenericName = request.GenericName,
                Manufacturer = request.Manufacturer,
                Description = request.Description,
                HSNCode = request.HSNCode,
                Barcode = request.Barcode,
                ReorderLevel = request.ReorderLevel,
                IsPrescriptionRequired = request.IsPrescriptionRequired,
                CategoryId = request.CategoryId,
                SupplierId = request.SupplierId,
                IsActive = true
            };

            await _unitOfWork.Repository<Medicine>().AddAsync(medicine);

            if (!string.IsNullOrEmpty(request.BatchNumber))
            {
                var batch = new InventoryBatch
                {
                    MedicineId = medicine.Id,
                    BatchNumber = request.BatchNumber,
                    ManufacturingDate = request.ManufacturingDate ?? DateTime.UtcNow,
                    ExpiryDate = request.ExpiryDate ?? DateTime.UtcNow.AddYears(2),
                    MfgLicenseNumber = request.MfgLicenseNumber ?? string.Empty,
                    Quantity = request.Quantity ?? 0,
                    AvailableQuantity = request.Quantity ?? 0,
                    PurchasePrice = request.PurchasePrice ?? 0,
                    SellingPrice = request.SellingPrice ?? 0,
                    MRP = request.MRP ?? 0,
                    TaxPercentage = request.TaxPercentage ?? 0
                };
                await _unitOfWork.Repository<InventoryBatch>().AddAsync(batch);
            }

            await _unitOfWork.CompleteAsync();
            return await GetByIdAsync(medicine.Id);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
        {
            var medicine = await _unitOfWork.Repository<Medicine>().GetByIdAsync(id);
            if (medicine == null) return ApiResponse<bool>.ErrorResponse("Not found");

            medicine.IsDeleted = true;
            await _unitOfWork.Repository<Medicine>().UpdateAsync(medicine);
            await _unitOfWork.CompleteAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<IReadOnlyList<MedicineDto>>> SearchAsync(string query)
        {
            var medicines = await _unitOfWork.Repository<Medicine>().GetAsync(m => 
                m.Name.Contains(query) || 
                m.GenericName.Contains(query) || 
                m.Barcode.Contains(query));
            
            var dtos = await MapToDtos(medicines);
            return ApiResponse<IReadOnlyList<MedicineDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<MedicineDto>> GetByBarcodeAsync(string barcode)
        {
            var medicine = (await _unitOfWork.Repository<Medicine>().GetAsync(m => m.Barcode == barcode)).FirstOrDefault();
            if (medicine == null) return ApiResponse<MedicineDto>.ErrorResponse("Barcode not found");
            
            var dtos = await MapToDtos(new[] { medicine });
            return ApiResponse<MedicineDto>.SuccessResponse(dtos.First());
        }

        private async Task<IReadOnlyList<MedicineDto>> MapToDtos(IEnumerable<Medicine> medicines)
        {
            var dtos = new List<MedicineDto>();
            var categoryRepo = _unitOfWork.Repository<Category>();
            var supplierRepo = _unitOfWork.Repository<Supplier>();

            foreach (var medicine in medicines)
            {
                var category = await categoryRepo.GetByIdAsync(medicine.CategoryId);
                var supplier = medicine.SupplierId.HasValue ? await supplierRepo.GetByIdAsync(medicine.SupplierId.Value) : null;

                dtos.Add(new MedicineDto
                {
                    Id = medicine.Id,
                    Name = medicine.Name,
                    GenericName = medicine.GenericName,
                    Manufacturer = medicine.Manufacturer,
                    Description = medicine.Description,
                    HSNCode = medicine.HSNCode,
                    Barcode = medicine.Barcode,
                    ReorderLevel = medicine.ReorderLevel,
                    IsPrescriptionRequired = medicine.IsPrescriptionRequired,
                    IsActive = medicine.IsActive,
                    CategoryId = medicine.CategoryId,
                    CategoryName = category?.Name ?? "Unknown",
                    SupplierId = medicine.SupplierId,
                    SupplierName = supplier?.Name ?? string.Empty
                });
            }
            return dtos;
        }
    }
}
