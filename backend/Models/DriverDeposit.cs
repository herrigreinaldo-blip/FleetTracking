using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Driver van security deposit escrow account (e.g. £800 - £1,000 target funded via £200 installments).
/// </summary>
public class DriverDeposit
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    /// <summary>
    /// Total escrow target to accumulate (typically £800 or £1,000).
    /// </summary>
    public decimal TargetDeposit { get; set; } = 1000.00m;

    /// <summary>
    /// Current accumulated escrow balance.
    /// </summary>
    public decimal CurrentBalance { get; set; } = 0.00m;

    /// <summary>
    /// Installment deducted per pay period (typically £200.00).
    /// </summary>
    public decimal InstallmentAmount { get; set; } = 200.00m;

    public bool IsFullyPaid => CurrentBalance >= TargetDeposit;

    public decimal RemainingDepositNeeded => Math.Max(0.00m, TargetDeposit - CurrentBalance);

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastDeductionDate { get; set; }

    // Navigation properties
    public ICollection<DriverDepositTransaction> Transactions { get; set; } = new List<DriverDepositTransaction>();

    /// <summary>
    /// Calculates the next deduction amount, ensuring we never exceed the target deposit cap.
    /// </summary>
    public decimal CalculateNextDeductionAmount()
    {
        if (IsFullyPaid) return 0.00m;
        return Math.Min(InstallmentAmount, RemainingDepositNeeded);
    }
}
