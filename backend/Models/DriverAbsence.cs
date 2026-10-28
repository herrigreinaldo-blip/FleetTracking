using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Driver absence or leave record (Holidays, Sickness, Days Off, Emergencies).
/// </summary>
public class DriverAbsence
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid DriverId { get; set; }
    public DriverProfile? Driver { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public AbsenceType Type { get; set; } = AbsenceType.Holiday;

    [MaxLength(150)]
    public string ApprovedBy { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Notes { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool OverlapsWith(DateTime date) => date.Date >= StartDate.Date && date.Date <= EndDate.Date;
}
