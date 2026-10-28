using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Individual financial inflow or outflow on a corporate bank account with relational smart-linking.
/// </summary>
public class BankTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid BankAccountId { get; set; }
    public BankAccount? BankAccount { get; set; }

    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

    public decimal Amount { get; set; } = 0.00m;

    public TransactionType Type { get; set; } = TransactionType.Outflow;

    public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;

    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(150)]
    public string PayeeDestination { get; set; } = string.Empty;

    /// <summary>
    /// Checkbox confirming bank reconciliation / match against physical statement.
    /// </summary>
    public bool IsConfirmed { get; set; } = false;

    /// <summary>
    /// URL to digital receipt / invoice attachment for HMRC VAT compliance.
    /// </summary>
    [MaxLength(500)]
    public string? ReceiptUrl { get; set; }

    // Relational Smart-Linkers (Fulfills client's primary automation requirement)
    /// <summary>
    /// If expense is for a van (fuel, repair, part, lease), auto-links to this vehicle's fleet log.
    /// </summary>
    public Guid? LinkedVehicleId { get; set; }
    public Vehicle? LinkedVehicle { get; set; }

    /// <summary>
    /// If expense is a mid-period driver cash advance ("ADIANTAMENTO"), auto-links to this driver's payroll deductions.
    /// </summary>
    public Guid? LinkedDriverId { get; set; }
    public DriverProfile? LinkedDriver { get; set; }

    // UK VAT Compliance
    public bool IsVatApplicable { get; set; } = true;
    public decimal VatRate { get; set; } = 20.00m;
    public decimal VatElement { get; set; } = 0.00m;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Automatically calculates the input/output VAT element from a gross amount based on UK VAT rules (Gross * 1/6 for 20%).
    /// </summary>
    public void ComputeVatElement()
    {
        if (!IsVatApplicable || VatRate <= 0)
        {
            VatElement = 0.00m;
            return;
        }

        // UK gross-to-VAT formula: Amount - (Amount / (1 + Rate/100))
        decimal netAmount = Math.Round(Amount / (1.0m + (VatRate / 100.0m)), 2);
        VatElement = Math.Round(Amount - netAmount, 2);
    }
}
