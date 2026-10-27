using DeliveryFinance.Api.DTOs;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using DeliveryFinance.Api.Services.Interfaces;

namespace DeliveryFinance.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IRoleRepository _roleRepo;
    private readonly ITokenService _tokenService;

    public AuthService(
        IUserRepository userRepo,
        IRoleRepository roleRepo,
        ITokenService tokenService)
    {
        _userRepo = userRepo;
        _roleRepo = roleRepo;
        _tokenService = tokenService;
    }

    public async Task<(bool Success, AuthResponseDto? Response, string? Error)> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepo.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            return (false, null, "User with this email already exists.");

        // Query available roles from the database table
        var dbRoles = (await _roleRepo.GetAllRolesAsync()).ToList();
        var targetRoleName = string.IsNullOrWhiteSpace(dto.Role) ? "Customer" : dto.Role.Trim();

        var matchedRole = dbRoles.FirstOrDefault(r => r.Name != null && r.Name.Equals(targetRoleName, StringComparison.OrdinalIgnoreCase));
        if (matchedRole == null)
        {
            var availableNames = string.Join(", ", dbRoles.Select(r => r.Name));
            return (false, null, $"Invalid role '{targetRoleName}'. Available roles in database: {availableNames}");
        }

        var normalizedRoleName = matchedRole.Name!;

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userRepo.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return (false, null, errors);
        }

        await _userRepo.AddToRoleAsync(user, normalizedRoleName);

        var (token, expiresAt) = await _tokenService.GenerateTokenAsync(user);
        var roles = await _userRepo.GetRolesAsync(user);

        return (true, new AuthResponseDto
        {
            Token = token,
            Email = user.Email ?? string.Empty,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Roles = roles,
            ExpiresAt = expiresAt
        }, null);
    }

    public async Task<(bool Success, AuthResponseDto? Response, string? Error)> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !await _userRepo.CheckPasswordAsync(user, dto.Password))
        {
            return (false, null, "Invalid email or password.");
        }

        var (token, expiresAt) = await _tokenService.GenerateTokenAsync(user);
        var roles = await _userRepo.GetRolesAsync(user);

        return (true, new AuthResponseDto
        {
            Token = token,
            Email = user.Email ?? string.Empty,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Roles = roles,
            ExpiresAt = expiresAt
        }, null);
    }

    public async Task<UserInfoDto?> GetCurrentUserAsync(string userId)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null) return null;

        var roles = await _userRepo.GetRolesAsync(user);
        return new UserInfoDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<(bool Success, string Message, IList<string>? Roles)> AssignRoleAsync(AssignRoleDto dto)
    {
        var role = await _roleRepo.GetByNameAsync(dto.Role.Trim());
        if (role == null)
        {
            var allRoles = await _roleRepo.GetAllRolesAsync();
            var names = string.Join(", ", allRoles.Select(r => r.Name));
            return (false, $"Role '{dto.Role}' not found in database. Existing roles: {names}", null);
        }

        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null)
            return (false, "User not found.", null);

        var roleName = role.Name!;
        if (!await _userRepo.IsInRoleAsync(user, roleName))
        {
            var addResult = await _userRepo.AddToRoleAsync(user, roleName);
            if (!addResult.Succeeded)
            {
                var errors = string.Join(", ", addResult.Errors.Select(e => e.Description));
                return (false, errors, null);
            }
        }

        var updatedRoles = await _userRepo.GetRolesAsync(user);
        return (true, $"Role '{roleName}' assigned successfully to {user.Email}.", updatedRoles);
    }
}
