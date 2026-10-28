using System.ComponentModel.DataAnnotations;

namespace DeliveryFinance.Api.Models;

/// <summary>
/// Digital document attachment (MOT Certificate, Insurance Policy, V5C Logbook, Lease Agreement).
/// </summary>
public class VehicleDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public VehicleDocumentType DocumentType { get; set; } = VehicleDocumentType.MotCertificate;

    [Required]
    [MaxLength(500)]
    public string FileUrl { get; set; } = string.Empty;

    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ExpiryDate { get; set; }
}
