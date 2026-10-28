using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Represents a corporate legal entity (e.g. MS Herrig Ltd, TGB Services Ltd, GoConnect).
/// </summary>
public class Company
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string CompanyNumber { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? VatNumber { get; set; }

    /// <summary>
    /// Default target monthly drawings for directors (default £5,000 as seen in finance spreadsheet).
    /// </summary>
    public decimal DefaultDirectorSalaryTarget { get; set; } = 5000.00m;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Franchise> Franchises { get; set; } = new List<Franchise>();
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
