using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Categories;
using MediRaksha.Application.Interfaces;
using MediRaksha.Domain.Entities;
using MediRaksha.Shared.Models;

namespace MediRaksha.Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<IReadOnlyList<CategoryDto>>> GetAllAsync()
        {
            var categories = await _unitOfWork.Repository<Category>().GetAllAsync();
            var dtos = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            }).ToList();

            return ApiResponse<IReadOnlyList<CategoryDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryRequest request)
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description
            };

            await _unitOfWork.Repository<Category>().AddAsync(category);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            });
        }
    }
}
