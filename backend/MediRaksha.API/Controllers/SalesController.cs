using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediRaksha.Application.DTOs.Sales;
using MediRaksha.Application.Interfaces;
using MediRaksha.Shared.Models;

namespace MediRaksha.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SalesController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<SaleDto>>>> GetAll()
        {
            var result = await _saleService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<SaleDto>>> GetById(Guid id)
        {
            var result = await _saleService.GetByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<SaleDto>>> Create([FromBody] CreateSaleRequest request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized(ApiResponse<SaleDto>.ErrorResponse("Unauthorized"));
            }

            var result = await _saleService.CreateAsync(request, userId);
            if (!result.Success) return BadRequest(result);
            
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
        }

        [HttpGet("{id}/invoice")]
        public async Task<IActionResult> DownloadInvoice(Guid id)
        {
            var result = await _saleService.GenerateInvoicePdfAsync(id);
            if (!result.Success) return BadRequest(result);
            
            return File(result.Data!, "application/pdf", $"Invoice_{id}.pdf");
        }
    }
}
