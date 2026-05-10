using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.InventoryBatches;
using MediRaksha.Shared.Models;

namespace MediRaksha.Application.Interfaces
{
    public interface IInventoryBatchService
    {
        Task<ApiResponse<IReadOnlyList<InventoryBatchDto>>> GetAllAsync();
        Task<ApiResponse<InventoryBatchDto>> CreateAsync(CreateInventoryBatchRequest request);
        Task<ApiResponse<IReadOnlyList<InventoryBatchDto>>> GetByMedicineIdAsync(Guid medicineId);
    }
}
