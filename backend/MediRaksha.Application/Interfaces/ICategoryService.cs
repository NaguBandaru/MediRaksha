using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Categories;
using MediRaksha.Shared.Models;

namespace MediRaksha.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<IReadOnlyList<CategoryDto>>> GetAllAsync();
        Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryRequest request);
    }
}
