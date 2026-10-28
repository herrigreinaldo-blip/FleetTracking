using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Individual installment, deduction, or refund transaction against a driver's van deposit.
/// </summary>
public class DriverDepositTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid DriverDepositId { get; set; }
    public DriverDeposit? DriverDeposit { get; set; }

    /// <summary>
    /// Optional link to the pay period in which this deduction occurred.
    /// </summary>
    public Guid? PayPeriodId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public decimal Amount { get; set; }

    public DepositTransactionType Type { get; set; } = DepositTransactionType.Deduction;

    [MaxLength(255)]
    public string Notes { get; set; } = string.Empty;
}
