using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Suppliers;
using MediRaksha.Application.Interfaces;
using MediRaksha.Domain.Entities;
using MediRaksha.Shared.Models;

namespace MediRaksha.Infrastructure.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SupplierService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<IReadOnlyList<SupplierDto>>> GetAllAsync()
        {
            var suppliers = await _unitOfWork.Repository<Supplier>().GetAllAsync();
            var dtos = suppliers.Select(s => new SupplierDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactPerson = s.ContactPerson,
                Email = s.Email,
                Phone = s.Phone,
                Address = s.Address,
                GSTNumber = s.GSTNumber,
                IsActive = s.IsActive
            }).ToList();

            return ApiResponse<IReadOnlyList<SupplierDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<SupplierDto>> CreateAsync(CreateSupplierRequest request)
        {
            var supplier = new Supplier
            {
                Name = request.Name,
                ContactPerson = request.ContactPerson,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                GSTNumber = request.GSTNumber,
                IsActive = true
            };

            await _unitOfWork.Repository<Supplier>().AddAsync(supplier);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<SupplierDto>.SuccessResponse(new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                GSTNumber = supplier.GSTNumber,
                IsActive = supplier.IsActive
            });
        }
    }
}
