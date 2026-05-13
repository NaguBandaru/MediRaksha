using System;
using System.Collections.Generic;

namespace MediRaksha.Application.DTOs.Auth
{
    public class AuthResponse
    {
        public Guid Id { get; set; } // Or int if it was int
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
