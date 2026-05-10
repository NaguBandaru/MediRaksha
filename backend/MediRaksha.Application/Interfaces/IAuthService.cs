using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Auth;
using MediRaksha.Shared.Models;

namespace MediRaksha.Application.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    }
}
