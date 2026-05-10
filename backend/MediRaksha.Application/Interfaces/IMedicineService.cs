using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Medicines;
using MediRaksha.Shared.Models;

namespace MediRaksha.Application.Interfaces
{
    public interface IMedicineService
    {
        Task<ApiResponse<IReadOnlyList<MedicineDto>>> GetAllAsync();
        Task<ApiResponse<MedicineDto>> GetByIdAsync(Guid id);
        Task<ApiResponse<MedicineDto>> CreateAsync(CreateMedicineRequest request);
        Task<ApiResponse<bool>> DeleteAsync(Guid id);
        Task<ApiResponse<IReadOnlyList<MedicineDto>>> SearchAsync(string query);
        Task<ApiResponse<MedicineDto>> GetByBarcodeAsync(string barcode);
    }
}
