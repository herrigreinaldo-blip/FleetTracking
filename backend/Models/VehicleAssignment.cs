using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Driver log book / custody tracking for which driver is operating which vehicle over time.
/// </summary>
public class VehicleAssignment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    public DateTime StartDate { get; set; } = DateTime.UtcNow;

    public DateTime? EndDate { get; set; }

    public bool IsCurrent { get; set; } = true;

    [MaxLength(255)]
    public string Notes { get; set; } = string.Empty;
}
