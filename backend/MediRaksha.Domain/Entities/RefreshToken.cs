using System;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public string ReplacedByToken { get; set; } = string.Empty;

        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsActive => !IsRevoked && !IsExpired;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
