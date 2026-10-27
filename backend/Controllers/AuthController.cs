using System.Security.Claims;
using DeliveryFinance.Api.DTOs;
using DeliveryFinance.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IRoleService _roleService;

    public AuthController(IAuthService authService, IRoleService roleService)
    {
        _authService = authService;
        _roleService = roleService;
    }

    /// <summary>
    /// Register a new user with a specified role (validated dynamically against roles in the database).
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, response, error) = await _authService.RegisterAsync(dto);
        if (!success)
            return BadRequest(new { message = error });

        return Ok(response);
    }

    /// <summary>
    /// Authenticate a user and receive a JWT token with their assigned roles.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, response, error) = await _authService.LoginAsync(dto);
        if (!success)
            return Unauthorized(new { message = error });

        return Ok(response);
    }

    /// <summary>
    /// Get the current authenticated user profile and roles.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _authService.GetCurrentUserAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(user);
    }

    /// <summary>
    /// Assign a role to a user (Restricted to Admin).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, message, roles) = await _authService.AssignRoleAsync(dto);
        if (!success)
            return BadRequest(new { message });

        return Ok(new { message, roles });
    }

    /// <summary>
    /// Get all available roles dynamically queried from the database table.
    /// </summary>
    [HttpGet("roles")]
    public async Task<IActionResult> GetAvailableRoles()
    {
        var roles = await _roleService.GetAllRolesAsync();
        return Ok(roles);
    }
}
