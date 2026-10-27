using System.Security.Claims;
using DeliveryFinance.Api.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    /// <summary>
    /// Admin-only endpoint.
    /// </summary>
    [Authorize(Roles = UserRoles.Admin)]
    [HttpGet("admin")]
    public IActionResult GetAdminDashboard()
    {
        return Ok(new
        {
            message = "Welcome to the Admin Dashboard. Full management access granted.",
            user = User.Identity?.Name,
            role = UserRoles.Admin,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Delivery-only endpoint.
    /// </summary>
    [Authorize(Roles = UserRoles.Delivery)]
    [HttpGet("delivery")]
    public IActionResult GetDeliveryDashboard()
    {
        return Ok(new
        {
            message = "Welcome to the Delivery Dashboard. Active assignments and routes available.",
            user = User.Identity?.Name,
            role = UserRoles.Delivery,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Customer-only endpoint.
    /// </summary>
    [Authorize(Roles = UserRoles.Customer)]
    [HttpGet("customer")]
    public IActionResult GetCustomerDashboard()
    {
        return Ok(new
        {
            message = "Welcome to the Customer Portal. Order history and tracking available.",
            user = User.Identity?.Name,
            role = UserRoles.Customer,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Endpoint accessible by any authenticated user (Admin, Delivery, or Customer).
    /// </summary>
    [Authorize]
    [HttpGet("overview")]
    public IActionResult GetUserOverview()
    {
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        return Ok(new
        {
            message = "Authenticated user overview.",
            user = User.Identity?.Name,
            roles,
            timestamp = DateTime.UtcNow
        });
    }
}
