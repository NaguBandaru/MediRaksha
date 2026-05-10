using System;
using System.Linq;
using System.Threading.Tasks;
using MediRaksha.Application.DTOs.Auth;
using MediRaksha.Application.Interfaces;
using MediRaksha.Domain.Entities;
using MediRaksha.Shared.Models;

namespace MediRaksha.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITokenService _tokenService;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService, IPasswordHasher passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var userRepo = _unitOfWork.Repository<User>();
            var users = await userRepo.GetAsync(u => u.Email == request.Email);
            var user = users.FirstOrDefault();

            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return ApiResponse<AuthResponse>.ErrorResponse("Invalid credentials");
            }

            if (!user.IsActive)
            {
                return ApiResponse<AuthResponse>.ErrorResponse("User account is disabled");
            }

            // Get Roles (assuming eager loading or fetching separately if no tracking)
            var userRolesRepo = _unitOfWork.Repository<UserRole>();
            var userRoles = await userRolesRepo.GetAsync(ur => ur.UserId == user.Id);
            
            var roleRepo = _unitOfWork.Repository<Role>();
            var roles = new System.Collections.Generic.List<string>();
            foreach(var ur in userRoles)
            {
                var role = await roleRepo.GetByIdAsync(ur.RoleId);
                if(role != null) roles.Add(role.Name);
            }

            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken(user);

            var refreshTokenRepo = _unitOfWork.Repository<RefreshToken>();
            await refreshTokenRepo.AddAsync(refreshToken);
            await _unitOfWork.CompleteAsync();

            var response = new AuthResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response);
        }

        public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            var userRepo = _unitOfWork.Repository<User>();
            var existingUsers = await userRepo.GetAsync(u => u.Email == request.Email);

            if (existingUsers.Any())
            {
                return ApiResponse<AuthResponse>.ErrorResponse("Email is already registered");
            }

            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                IsActive = true
            };

            await userRepo.AddAsync(newUser);
            await _unitOfWork.CompleteAsync();

            // Default Role assignment can be added here
            
            var response = new AuthResponse
            {
                Id = newUser.Id,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                Roles = new System.Collections.Generic.List<string>(),
                AccessToken = "", // Might need login
                RefreshToken = ""
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response, "User registered successfully. Please login.");
        }

        public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
        {
            var refreshTokenRepo = _unitOfWork.Repository<RefreshToken>();
            var tokens = await refreshTokenRepo.GetAsync(r => r.Token == request.RefreshToken);
            var existingToken = tokens.FirstOrDefault();

            if (existingToken == null || !existingToken.IsActive)
            {
                return ApiResponse<AuthResponse>.ErrorResponse("Invalid or expired refresh token");
            }

            var userRepo = _unitOfWork.Repository<User>();
            var user = await userRepo.GetByIdAsync(existingToken.UserId);

            if (user == null || !user.IsActive)
            {
                return ApiResponse<AuthResponse>.ErrorResponse("User not found or disabled");
            }

            existingToken.IsRevoked = true;
            await refreshTokenRepo.UpdateAsync(existingToken);

            // Fetch roles
            var userRolesRepo = _unitOfWork.Repository<UserRole>();
            var userRoles = await userRolesRepo.GetAsync(ur => ur.UserId == user.Id);
            
            var roleRepo = _unitOfWork.Repository<Role>();
            var roles = new System.Collections.Generic.List<string>();
            foreach(var ur in userRoles)
            {
                var role = await roleRepo.GetByIdAsync(ur.RoleId);
                if(role != null) roles.Add(role.Name);
            }

            var newAccessToken = _tokenService.GenerateAccessToken(user, roles);
            var newRefreshToken = _tokenService.GenerateRefreshToken(user);

            await refreshTokenRepo.AddAsync(newRefreshToken);
            await _unitOfWork.CompleteAsync();

            var response = new AuthResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles,
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response);
        }
    }
}
