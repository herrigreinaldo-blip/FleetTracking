using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Operational payroll and carrier reconciliation cycle (4-weekly, weekly, or monthly).
/// </summary>
public class PayPeriod
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public PayPeriodType PeriodType { get; set; } = PayPeriodType.FourWeekly;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    /// <summary>
    /// Date on which driver payouts are remitted (e.g. the Friday following period end).
    /// </summary>
    [Required]
    public DateTime PaymentDate { get; set; }

    public PayPeriodStatus Status { get; set; } = PayPeriodStatus.Open;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<DriverPayslip> Payslips { get; set; } = new List<DriverPayslip>();
    public ICollection<CarrierReconciliationRecord> CarrierReconciliations { get; set; } = new List<CarrierReconciliationRecord>();
    public ICollection<FuelCardTransaction> FuelCardTransactions { get; set; } = new List<FuelCardTransaction>();
}
