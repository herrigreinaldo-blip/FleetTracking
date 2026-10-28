using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Fleet vehicle profile, financing details, and telemetry.
/// </summary>
public class Vehicle
{
    private string _registration = string.Empty;

    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// UK Vehicle registration plate (e.g. "KR23 XYZ"). Automatically normalized.
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Registration
    {
        get => _registration;
        set => _registration = NormalizeRegistration(value);
    }

    [Required]
    [MaxLength(50)]
    public string Make { get; set; } = string.Empty; // e.g. MERCEDES, FORD

    [Required]
    [MaxLength(50)]
    public string Model { get; set; } = string.Empty; // e.g. SPRINTER, TRANSIT

    public int Year { get; set; } = DateTime.UtcNow.Year;

    public int CurrentMileage { get; set; } = 0;

    public FuelType FuelType { get; set; } = FuelType.Diesel;

    public OwnershipType OwnershipType { get; set; } = OwnershipType.Owned;

    public Guid CompanyId { get; set; }
    public Company? Company { get; set; }

    // Financing & Loan Telemetry (Matches KR23XYZ sheet)
    public decimal PurchasePrice { get; set; } = 0.00m;
    public decimal DepositPaid { get; set; } = 0.00m;
    public decimal MonthlyFinancePayment { get; set; } = 0.00m;
    public int FinanceTermMonths { get; set; } = 48;
    public decimal RemainingFinanceBalance { get; set; } = 0.00m;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public VehicleCompliance? Compliance { get; set; }
    public ICollection<VehicleServiceLog> ServiceLogs { get; set; } = new List<VehicleServiceLog>();
    public ICollection<VehicleDocument> Documents { get; set; } = new List<VehicleDocument>();
    public ICollection<VehicleAssignment> Assignments { get; set; } = new List<VehicleAssignment>();

    public static string NormalizeRegistration(string? reg)
    {
        if (string.IsNullOrWhiteSpace(reg)) return string.Empty;
        return string.Concat(reg.Where(c => !char.IsWhiteSpace(c))).ToUpperInvariant();
    }
}
