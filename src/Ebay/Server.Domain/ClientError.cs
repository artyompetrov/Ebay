using System.ComponentModel.DataAnnotations;

namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class ClientError
{
    /// <summary>
    /// свойство.
    /// </summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public string Url { get; set; } = null!;


    /// <summary>
    /// свойство.
    /// </summary>
    public string ErrorText { get; set; } = null!;
}
