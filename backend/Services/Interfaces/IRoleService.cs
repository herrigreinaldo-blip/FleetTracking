using DeliveryFinance.Api.DTOs;

namespace DeliveryFinance.Api.Services.Interfaces;

public interface IRoleService
{
    Task<IEnumerable<RoleDto>> GetAllRolesAsync();
    Task<(bool Success, string Message)> CreateRoleAsync(string roleName);
    Task<bool> RoleExistsAsync(string roleName);
}
