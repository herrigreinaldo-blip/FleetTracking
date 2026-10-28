using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Reconciles carrier self-billing remittance against agreed route pricing (matches DPD Agreed vs Received in RONALDO sheet).
/// </summary>
public class CarrierReconciliationRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid PayPeriodId { get; set; }
    public PayPeriod? PayPeriod { get; set; }

    [Required]
    public Guid FranchiseId { get; set; }
    public Franchise? Franchise { get; set; }

    public DateTime Date { get; set; }

    [Required]
    [MaxLength(50)]
    public string RouteCode { get; set; } = string.Empty;

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    // Agreed Terms
    public int StopsAgreed { get; set; } = 0;
    public decimal PricePerStopAgreed { get; set; } = 0.00m;
    public decimal DayRateAgreed { get; set; } = 0.00m;
    public decimal AgreedTotal { get; set; } = 0.00m;

    // Carrier Remittance Breakdown (e.g. DPD self-billing)
    public decimal FirstRunPaid { get; set; } = 0.00m;
    public decimal SecRunPaid { get; set; } = 0.00m;
    public decimal ExtraRunPaid { get; set; } = 0.00m;
    public decimal TopUpPaid { get; set; } = 0.00m;
    public decimal TotalReceivedFromCarrier { get; set; } = 0.00m;

    /// <summary>
    /// Difference between amount received from carrier and agreed total (Negative indicates underpayment).
    /// </summary>
    public decimal Variance { get; set; } = 0.00m;

    public DisputeStatus Status { get; set; } = DisputeStatus.Matched;

    [MaxLength(255)]
    public string? DisputeNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public void Reconcile()
    {
        AgreedTotal = Math.Round((StopsAgreed * PricePerStopAgreed) + DayRateAgreed, 2);
        TotalReceivedFromCarrier = Math.Round(FirstRunPaid + SecRunPaid + ExtraRunPaid + TopUpPaid, 2);
        Variance = Math.Round(TotalReceivedFromCarrier - AgreedTotal, 2);

        if (Variance < -0.01m)
        {
            Status = DisputeStatus.Underpaid;
        }
        else if (Variance > 0.01m)
        {
            Status = DisputeStatus.Overpaid;
        }
        else
        {
            Status = DisputeStatus.Matched;
        }
    }
}
