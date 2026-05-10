using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediRaksha.Infrastructure.Services;
using MediRaksha.Shared.Models;

namespace MediRaksha.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class BackupController : ControllerBase
    {
        private readonly IBackupService _backupService;

        public BackupController(IBackupService backupService)
        {
            _backupService = backupService;
        }

        [HttpGet("history")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<BackupInfo>>>> GetHistory()
        {
            var result = await _backupService.GetBackupHistoryAsync();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<string>>> CreateBackup()
        {
            var result = await _backupService.CreateBackupAsync();
            return Ok(result);
        }

        [HttpPost("restore")]
        public async Task<ActionResult<ApiResponse<bool>>> RestoreBackup([FromQuery] string fileName)
        {
            var result = await _backupService.RestoreBackupAsync(fileName);
            return Ok(result);
        }
    }
}
