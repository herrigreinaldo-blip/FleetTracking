using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Individual fuel fill-up or EV charging charge linked to a specific driver card.
/// </summary>
public class FuelCardTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid FuelCardInvoiceId { get; set; }
    public FuelCardInvoice? FuelCardInvoice { get; set; }

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    /// <summary>
    /// Optional link to the fleet vehicle that was fueled.
    /// </summary>
    public Guid? VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    [MaxLength(50)]
    public string CardNumber { get; set; } = string.Empty;

    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

    public decimal Amount { get; set; } = 0.00m;

    public FuelType FuelType { get; set; } = FuelType.Diesel;

    /// <summary>
    /// Indicates whether this fuel cost has been deducted from the driver's periodic payslip ("DISCOUNTED: YES").
    /// </summary>
    public bool IsDiscountedFromPayroll { get; set; } = false;

    public DateTime? DiscountedDate { get; set; }

    /// <summary>
    /// Pay period in which this fuel was deducted.
    /// </summary>
    public Guid? PayPeriodId { get; set; }
    public PayPeriod? PayPeriod { get; set; }
}
