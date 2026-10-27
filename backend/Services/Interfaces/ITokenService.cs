using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Services.Interfaces;

public interface ITokenService
{
    Task<(string Token, DateTime ExpiresAt)> GenerateTokenAsync(ApplicationUser user);
}
