using DeliveryFinance.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<ApplicationUser?> GetByIdAsync(string id);
    Task<ApplicationUser?> GetByEmailAsync(string email);
    Task<IEnumerable<ApplicationUser>> GetAllAsync();
    Task<IdentityResult> CreateAsync(ApplicationUser user, string password);
    Task<IdentityResult> UpdateAsync(ApplicationUser user);
    Task<IdentityResult> DeleteAsync(ApplicationUser user);
    Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
    Task<IList<string>> GetRolesAsync(ApplicationUser user);
    Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string roleName);
    Task<IdentityResult> RemoveFromRoleAsync(ApplicationUser user, string roleName);
    Task<bool> IsInRoleAsync(ApplicationUser user, string roleName);
}
