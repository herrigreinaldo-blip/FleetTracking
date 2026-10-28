using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Individual driver remittance advice and gross-to-net pay calculation (matches RONALDO sheet).
/// </summary>
public class DriverPayslip
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid PayPeriodId { get; set; }
    public PayPeriod? PayPeriod { get; set; }

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    public int TotalDaysWorked { get; set; } = 0;
    public int TotalStopsCompleted { get; set; } = 0;

    /// <summary>
    /// Total earnings from deliveries and routes worked during the period.
    /// </summary>
    public decimal GrossDeliveryEarnings { get; set; } = 0.00m;

    /// <summary>
    /// Ad-hoc extra runs, bonuses, or training payments.
    /// </summary>
    public decimal ExtraPaymentsBonus { get; set; } = 0.00m;

    /// <summary>
    /// Admin fee deduction percentage (default 6%).
    /// </summary>
    public decimal AdminFeeRate { get; set; } = 6.00m;

    /// <summary>
    /// Calculated admin fee deducted from gross (e.g. £158.87 on £2,647.84).
    /// </summary>
    public decimal AdminFeeDeducted { get; set; } = 0.00m;

    /// <summary>
    /// Deducted if the company supplies the van.
    /// </summary>
    public decimal VanRentDeducted { get; set; } = 0.00m;

    /// <summary>
    /// Reconciled fuel card drawdowns during the period.
    /// </summary>
    public decimal FuelCardDeducted { get; set; } = 0.00m;

    /// <summary>
    /// Security deposit installment deduction (typically £200 up to £1,000 target).
    /// </summary>
    public decimal DepositDeducted { get; set; } = 0.00m;

    /// <summary>
    /// Mid-period cash advances deducted ("ADIANTAMENTO").
    /// </summary>
    public decimal CashAdvanceDeducted { get; set; } = 0.00m;

    /// <summary>
    /// Fines, PCNs, or vehicle damage penalties.
    /// </summary>
    public decimal FinesOrPenalties { get; set; } = 0.00m;

    /// <summary>
    /// Gross Total minus all deductions (Subtotal Ex. VAT).
    /// </summary>
    public decimal SubtotalExVat { get; set; } = 0.00m;

    public bool IsVatRegistered { get; set; } = false;

    public decimal VatRate { get; set; } = 20.00m;

    /// <summary>
    /// UK VAT @ 20% on ex-VAT total (if driver is VAT registered).
    /// </summary>
    public decimal VatAmount { get; set; } = 0.00m;

    /// <summary>
    /// Final net payment sent to the driver (Subtotal Ex. VAT + VAT).
    /// </summary>
    public decimal TotalNetPaid { get; set; } = 0.00m;

    [MaxLength(500)]
    public string? PdfInvoiceUrl { get; set; }

    [MaxLength(255)]
    public string? Comments { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Executes the standard UK accounting formula matching the RONALDO spreadsheet.
    /// </summary>
    public void RecalculateTotals()
    {
        decimal totalGross = Math.Round(GrossDeliveryEarnings + ExtraPaymentsBonus, 2);

        if (AdminFeeRate > 0)
        {
            AdminFeeDeducted = Math.Round(totalGross * (AdminFeeRate / 100.0m), 2);
        }
        else
        {
            AdminFeeDeducted = 0.00m;
        }

        decimal totalCharges = Math.Round(AdminFeeDeducted + VanRentDeducted + FuelCardDeducted + DepositDeducted + CashAdvanceDeducted + FinesOrPenalties, 2);

        SubtotalExVat = Math.Round(totalGross - totalCharges, 2);

        if (IsVatRegistered && VatRate > 0)
        {
            VatAmount = Math.Round(SubtotalExVat * (VatRate / 100.0m), 2);
        }
        else
        {
            VatAmount = 0.00m;
        }

        TotalNetPaid = Math.Round(SubtotalExVat + VatAmount, 2);
    }
}
