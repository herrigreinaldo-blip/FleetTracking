using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Subcontracted delivery driver profile, rate model, bank details, and van lease preferences.
/// </summary>
public class DriverProfile
{
    private string _drNumber = string.Empty;

    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    /// <summary>
    /// Carrier-assigned Driver identifier (e.g. "DR 85777").
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string DrNumber
    {
        get => _drNumber;
        set => _drNumber = NormalizeDrNumber(value);
    }

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty;

    /// <summary>
    /// UK Bank Sort Code (formatted as XX-XX-XX).
    /// </summary>
    [MaxLength(20)]
    public string BankSortCode { get; set; } = string.Empty;

    /// <summary>
    /// UK Bank Account Number (8 digits).
    /// </summary>
    [MaxLength(20)]
    public string BankAccountNumber { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? VatNumber { get; set; }

    /// <summary>
    /// Compensation model: DayRate, StopRate, or AdminFeeCommission.
    /// </summary>
    public RateModel RateType { get; set; } = RateModel.DayRate;

    public decimal DefaultDayRate { get; set; } = 200.00m;
    public decimal DefaultStopRate { get; set; } = 1.95m;

    /// <summary>
    /// Admin fee deducted from gross delivery earnings (default 6%).
    /// </summary>
    public decimal AdminFeePercentage { get; set; } = 6.00m;

    /// <summary>
    /// If false, the company supplies the van and charges periodic van rent.
    /// </summary>
    public bool SuppliesOwnVan { get; set; } = false;

    /// <summary>
    /// Periodic van rent deducted on each 4-week cycle (e.g. £1,187.16 - £1,612.02).
    /// </summary>
    public decimal PeriodicVanRent { get; set; } = 0.00m;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public DriverDeposit? Deposit { get; set; }
    public ICollection<RosterShift> RosterShifts { get; set; } = new List<RosterShift>();
    public ICollection<VehicleAssignment> VehicleAssignments { get; set; } = new List<VehicleAssignment>();
    public ICollection<DriverAbsence> Absences { get; set; } = new List<DriverAbsence>();

    public static string NormalizeDrNumber(string? drNumber)
    {
        if (string.IsNullOrWhiteSpace(drNumber)) return string.Empty;
        return string.Concat(drNumber.Where(c => !char.IsWhiteSpace(c))).ToUpperInvariant();
    }

    public static bool IsValidSortCode(string sortCode)
    {
        if (string.IsNullOrWhiteSpace(sortCode)) return false;
        return Regex.IsMatch(sortCode.Trim(), @"^\d{2}-\d{2}-\d{2}$|^\d{6}$");
    }

    public static bool IsValidAccountNumber(string accountNumber)
    {
        if (string.IsNullOrWhiteSpace(accountNumber)) return false;
        return Regex.IsMatch(accountNumber.Trim(), @"^\d{8}$");
    }
}
