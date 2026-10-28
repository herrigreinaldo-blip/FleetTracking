using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Master supplier fuel invoice (e.g. Shell card monthly invoice £2,305.85 in 30-09-26 sheet).
/// </summary>
public class FuelCardInvoice
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public FuelCardProvider Provider { get; set; } = FuelCardProvider.Shell;

    [Required]
    [MaxLength(100)]
    public string InvoiceNumber { get; set; } = string.Empty;

    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;

    public decimal TotalGrossAmount { get; set; } = 0.00m;

    public bool IsReconciled { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<FuelCardTransaction> Transactions { get; set; } = new List<FuelCardTransaction>();
}
