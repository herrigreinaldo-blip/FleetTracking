using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Represents a carrier franchise depot code (e.g. FD49693, FD45028) through which the carrier remits payments.
/// </summary>
public class Franchise
{
    private string _fdCode = string.Empty;

    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Franchise / Depot code (e.g. "FD49693"). Automatically trimmed and stripped of spaces.
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string FdCode
    {
        get => _fdCode;
        set => _fdCode = NormalizeFdCode(value);
    }

    [Required]
    [MaxLength(150)]
    public string DepotName { get; set; } = string.Empty;

    public Guid CarrierId { get; set; }
    public Carrier? Carrier { get; set; }

    public Guid CompanyId { get; set; }
    public Company? Company { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<RosterShift> RosterShifts { get; set; } = new List<RosterShift>();

    /// <summary>
    /// Strips spaces and capitalizes the FD code for clean unique indexing and matching.
    /// </summary>
    public static string NormalizeFdCode(string? code)
    {
        if (string.IsNullOrWhiteSpace(code)) return string.Empty;
        return string.Concat(code.Where(c => !char.IsWhiteSpace(c))).ToUpperInvariant();
    }
}
