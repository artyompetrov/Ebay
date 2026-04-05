using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Adapters.Driven.EF.WriteModel.Models;

[Table("MeasurementPhotos")]
public sealed class MeasurementPhotoEntity
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; set; }

    [MaxLength(100)]
    public required string MeasurementId { get; set; } = null!;

    [MaxLength(200)]
    public required string FileName { get; set; } = null!;

    [MaxLength(100)]
    public required string ContentType { get; set; } = null!;

    public int Order { get; set; }

    public required byte[] Content { get; set; } = null!;
}
