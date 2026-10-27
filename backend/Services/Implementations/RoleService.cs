using DeliveryFinance.Api.DTOs;
using DeliveryFinance.Api.Repositories.Interfaces;
using DeliveryFinance.Api.Services.Interfaces;

namespace DeliveryFinance.Api.Services.Implementations;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepo;

    public RoleService(IRoleRepository roleRepo)
    {
        _roleRepo = roleRepo;
    }

    public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
    {
        var roles = await _roleRepo.GetAllRolesAsync();
        return roles.Select(r => new RoleDto
        {
            Id = r.Id,
            Name = r.Name ?? string.Empty
        });
    }

    public async Task<(bool Success, string Message)> CreateRoleAsync(string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
            return (false, "Role name cannot be empty.");

        var trimmed = roleName.Trim();
        if (await _roleRepo.RoleExistsAsync(trimmed))
            return (false, $"Role '{trimmed}' already exists in database.");

        var result = await _roleRepo.CreateRoleAsync(trimmed);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return (false, errors);
        }

        return (true, $"Role '{trimmed}' created successfully in database.");
    }

    public async Task<bool> RoleExistsAsync(string roleName)
    {
        return await _roleRepo.RoleExistsAsync(roleName);
    }
}
