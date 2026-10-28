using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Compliance dates, insurance policies, road tax, and service thresholds for a vehicle.
/// </summary>
public class VehicleCompliance
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    // MOT
    public DateTime MotDueDate { get; set; }

    // Road Tax (VED)
    public DateTime RoadTaxDueDate { get; set; }
    public decimal AnnualRoadTaxCost { get; set; } = 360.00m;

    // Insurance
    public DateTime InsuranceDueDate { get; set; }
    public decimal MonthlyInsuranceCost { get; set; } = 0.00m;

    [MaxLength(100)]
    public string InsurancePolicyNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Insurer { get; set; } = string.Empty; // e.g. Admiral, Acorn, GoSkippy

    [MaxLength(255)]
    public string NamedDrivers { get; set; } = string.Empty;

    // Breakdown Recovery
    [MaxLength(100)]
    public string BreakdownRecoveryProvider { get; set; } = string.Empty; // e.g. RAC Recovery

    // Service Intervals
    public int NextServiceMileage { get; set; } = 0; // e.g. 139,000 miles
    public DateTime? NextServiceDueDate { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Helper properties for alert thresholds
    public bool IsMotDueSoon(int daysThreshold = 30) => (MotDueDate - DateTime.UtcNow).TotalDays <= daysThreshold && (MotDueDate - DateTime.UtcNow).TotalDays >= 0;
    public bool IsMotOverdue => MotDueDate < DateTime.UtcNow;

    public bool IsTaxDueSoon(int daysThreshold = 30) => (RoadTaxDueDate - DateTime.UtcNow).TotalDays <= daysThreshold && (RoadTaxDueDate - DateTime.UtcNow).TotalDays >= 0;
    public bool IsTaxOverdue => RoadTaxDueDate < DateTime.UtcNow;

    public bool IsInsuranceDueSoon(int daysThreshold = 30) => (InsuranceDueDate - DateTime.UtcNow).TotalDays <= daysThreshold && (InsuranceDueDate - DateTime.UtcNow).TotalDays >= 0;
    public bool IsInsuranceOverdue => InsuranceDueDate < DateTime.UtcNow;
}
