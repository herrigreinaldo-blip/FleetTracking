using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Represents a parcel delivery client/carrier (e.g. DPD, Amazon, DHL, DX, Parcel Force).
/// </summary>
public class Carrier
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public CarrierBillingFormat BillingFormat { get; set; } = CarrierBillingFormat.DpdCsv;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Franchise> Franchises { get; set; } = new List<Franchise>();
    public ICollection<RouteDefinition> Routes { get; set; } = new List<RouteDefinition>();
}
