using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Individual maintenance, parts, MOT, or repair record for a fleet vehicle.
/// </summary>
public class VehicleServiceLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int MileageAtService { get; set; }

    [Required]
    [MaxLength(255)]
    public string ServiceDescription { get; set; } = string.Empty; // e.g. "FULL CLUTCH KIT CHANGED", "MOT"

    public decimal LabourCost { get; set; } = 0.00m;
    public decimal PartsCost { get; set; } = 0.00m;
    public decimal TotalCost { get; set; } = 0.00m;

    [MaxLength(150)]
    public string SupplierOrGarage { get; set; } = string.Empty; // e.g. "P&D AUTOMOTIVE", "SAM MOTORS", "EURO CAR PARTS"

    [MaxLength(255)]
    public string Observation { get; set; } = string.Empty;

    /// <summary>
    /// Optional foreign key to the originating bank transaction if this expense was recorded from banking.
    /// </summary>
    public Guid? BankTransactionId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
