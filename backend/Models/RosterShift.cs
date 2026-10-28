using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// A daily scheduled or completed delivery route shift for a driver within a 4-week roster cycle.
/// </summary>
public class RosterShift
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    [Required]
    public Guid FranchiseId { get; set; }
    public Franchise? Franchise { get; set; }

    [Required]
    [MaxLength(50)]
    public string RouteCode { get; set; } = string.Empty; // e.g. "593", "202", "OFF"

    /// <summary>
    /// Stop rate multiplier / rate per stop (e.g. 1.20, 1.30, 1.45, 2.00, 3.00).
    /// </summary>
    public decimal StopRateMultiplier { get; set; } = 1.00m;

    [MaxLength(50)]
    public string PostCodeArea { get; set; } = string.Empty; // e.g. "BN1.5", "BULK", "BN11.1/2"

    public int ActualStopsCompleted { get; set; } = 0;

    /// <summary>
    /// Agreed daily rate (e.g. £250.00 or £200.00).
    /// </summary>
    public decimal AgreedDailyRate { get; set; } = 0.00m;

    /// <summary>
    /// Ad-hoc extra pay, rescue runs, or weekend premiums (e.g. £112.50, £270.00).
    /// </summary>
    public decimal ExtraPay { get; set; } = 0.00m;

    [MaxLength(255)]
    public string? Comments { get; set; }

    public ShiftStatus Status { get; set; } = ShiftStatus.Scheduled;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Calculates gross delivery earnings based on the driver's rate model.
    /// </summary>
    public decimal CalculateGrossEarnings(RateModel rateModel)
    {
        if (Status == ShiftStatus.Cancelled) return 0.00m;

        return rateModel switch
        {
            RateModel.DayRate => AgreedDailyRate + ExtraPay,
            RateModel.StopRate => (ActualStopsCompleted * StopRateMultiplier) + ExtraPay,
            RateModel.AdminFeeCommission => (AgreedDailyRate > 0 ? AgreedDailyRate : (ActualStopsCompleted * StopRateMultiplier)) + ExtraPay,
            _ => AgreedDailyRate + ExtraPay
        };
    }
}
