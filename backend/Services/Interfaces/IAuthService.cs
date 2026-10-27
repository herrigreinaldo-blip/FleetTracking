using DeliveryFinance.Api.DTOs;

namespace DeliveryFinance.Api.Services.Interfaces;

public interface IAuthService
{
    Task<(bool Success, AuthResponseDto? Response, string? Error)> RegisterAsync(RegisterDto dto);
    Task<(bool Success, AuthResponseDto? Response, string? Error)> LoginAsync(LoginDto dto);
    Task<UserInfoDto?> GetCurrentUserAsync(string userId);
    Task<(bool Success, string Message, IList<string>? Roles)> AssignRoleAsync(AssignRoleDto dto);
}
