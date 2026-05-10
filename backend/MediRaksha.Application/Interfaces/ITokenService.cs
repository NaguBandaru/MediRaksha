using System.Collections.Generic;
using MediRaksha.Domain.Entities;

namespace MediRaksha.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user, IList<string> roles);
        RefreshToken GenerateRefreshToken(User user);
    }
}
