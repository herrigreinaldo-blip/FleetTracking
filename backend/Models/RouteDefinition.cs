using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Definition of a carrier delivery route, depot area, and default stop rate multiplier.
/// </summary>
public class RouteDefinition
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    public string RouteCode { get; set; } = string.Empty; // e.g. "593", "202", "BN1.5"

    [MaxLength(100)]
    public string DepotArea { get; set; } = string.Empty; // e.g. "BN 1 BULK", "MPB", "Crawley"

    public decimal DefaultRateMultiplier { get; set; } = 1.00m;

    public Guid CarrierId { get; set; }
    public Carrier? Carrier { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
