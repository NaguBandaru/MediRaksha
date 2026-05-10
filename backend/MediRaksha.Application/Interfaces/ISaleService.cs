using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Sales;
using MediRaksha.Shared.Models;

namespace MediRaksha.Application.Interfaces
{
    public interface ISaleService
    {
        Task<ApiResponse<SaleDto>> GetByIdAsync(Guid id);
        Task<ApiResponse<IReadOnlyList<SaleDto>>> GetAllAsync();
        Task<ApiResponse<SaleDto>> CreateAsync(CreateSaleRequest request, Guid userId);
        Task<ApiResponse<byte[]>> GenerateInvoicePdfAsync(Guid saleId);
    }
}
