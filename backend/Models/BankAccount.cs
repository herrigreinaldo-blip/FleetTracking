using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Corporate bank account for one of the operating entities (MS Herrig Ltd, TGB Services Ltd, GoConnect).
/// </summary>
public class BankAccount
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompanyId { get; set; }
    public Company? Company { get; set; }

    [Required]
    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty; // e.g. NatWest, Monzo, Barclays

    [Required]
    [MaxLength(20)]
    public string AccountNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string SortCode { get; set; } = string.Empty;

    [MaxLength(3)]
    public string Currency { get; set; } = "GBP";

    public decimal InitialBalance { get; set; } = 0.00m;

    public decimal CurrentBalance { get; set; } = 0.00m;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<BankTransaction> Transactions { get; set; } = new List<BankTransaction>();
}
