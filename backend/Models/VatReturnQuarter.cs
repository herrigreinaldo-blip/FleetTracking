using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Quarterly UK VAT return calculations for HMRC Making Tax Digital (matches 01-07-26 TO 30-09-26 sheet).
/// </summary>
public class VatReturnQuarter
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompanyId { get; set; }
    public Company? Company { get; set; }

    [Required]
    [MaxLength(50)]
    public string QuarterName { get; set; } = string.Empty; // e.g. "Q3 2026 (01/07/26 - 30/09/26)"

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    /// <summary>
    /// Total Output VAT collected from carrier billings (e.g. DPD FD invoices).
    /// </summary>
    public decimal TotalOutputVatReceived { get; set; } = 0.00m;

    /// <summary>
    /// Total Input VAT paid on purchases (fuel, vehicle parts, van leases, tools, accountant).
    /// </summary>
    public decimal TotalInputVatPaid { get; set; } = 0.00m;

    /// <summary>
    /// Net VAT due to HMRC: Output VAT - Input VAT.
    /// </summary>
    public decimal NetVatDue { get; set; } = 0.00m;

    /// <summary>
    /// Amount actually remitted / paid to HMRC.
    /// </summary>
    public decimal AmountPaidToHmrc { get; set; } = 0.00m;

    /// <summary>
    /// Difference between amount paid to HMRC and net calculated liability.
    /// </summary>
    public decimal Variance { get; set; } = 0.00m;

    public VatReturnStatus Status { get; set; } = VatReturnStatus.Draft;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }

    public void Reconcile()
    {
        NetVatDue = Math.Round(TotalOutputVatReceived - TotalInputVatPaid, 2);
        Variance = Math.Round(AmountPaidToHmrc - NetVatDue, 2);
    }
}
