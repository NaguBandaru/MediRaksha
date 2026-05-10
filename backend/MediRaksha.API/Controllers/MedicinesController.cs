using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediRaksha.Application.DTOs.Medicines;
using MediRaksha.Application.Interfaces;
using MediRaksha.Shared.Models;

namespace MediRaksha.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MedicinesController : ControllerBase
    {
        private readonly IMedicineService _medicineService;

        public MedicinesController(IMedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<MedicineDto>>>> GetAll()
        {
            var result = await _medicineService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<MedicineDto>>> GetById(Guid id)
        {
            var result = await _medicineService.GetByIdAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<MedicineDto>>> Create([FromBody] CreateMedicineRequest request)
        {
            var result = await _medicineService.CreateAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var result = await _medicineService.DeleteAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<MedicineDto>>>> Search([FromQuery] string q)
        {
            var result = await _medicineService.SearchAsync(q);
            return Ok(result);
        }

        [HttpGet("barcode/{barcode}")]
        public async Task<ActionResult<ApiResponse<MedicineDto>>> GetByBarcode(string barcode)
        {
            var result = await _medicineService.GetByBarcodeAsync(barcode);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}
