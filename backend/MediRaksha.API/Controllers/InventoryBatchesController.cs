using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediRaksha.Application.Interfaces;
using MediRaksha.Application.DTOs.InventoryBatches;
using MediRaksha.Shared.Models;

namespace MediRaksha.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryBatchesController : ControllerBase
    {
        private readonly IInventoryBatchService _inventoryBatchService;

        public InventoryBatchesController(IInventoryBatchService inventoryBatchService)
        {
            _inventoryBatchService = inventoryBatchService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryBatchDto>>>> GetAll([FromQuery] Guid? medicineId)
        {
            var result = await _inventoryBatchService.GetByMedicineIdAsync(medicineId ?? Guid.Empty);
            return Ok(result);
        }
    }
}
