using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Suppliers;
using MediRaksha.Shared.Models;

namespace MediRaksha.Application.Interfaces
{
    public interface ISupplierService
    {
        Task<ApiResponse<IReadOnlyList<SupplierDto>>> GetAllAsync();
        Task<ApiResponse<SupplierDto>> CreateAsync(CreateSupplierRequest request);
    }
}
