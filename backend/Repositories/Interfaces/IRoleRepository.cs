using Microsoft.AspNetCore.Identity;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IRoleRepository
{
    Task<IEnumerable<IdentityRole>> GetAllRolesAsync();
    Task<IdentityRole?> GetByNameAsync(string roleName);
    Task<IdentityRole?> GetByIdAsync(string roleId);
    Task<bool> RoleExistsAsync(string roleName);
    Task<IdentityResult> CreateRoleAsync(string roleName);
    Task<IdentityResult> DeleteRoleAsync(string roleName);
}
