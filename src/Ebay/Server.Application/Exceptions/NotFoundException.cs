namespace Server.Application.Exceptions;

/// <summary>
/// Сценарий не может быть выполнен, потому что запрошенная сущность не существует.
/// Driving-адаптеры переводят это исключение в свой ответ "не найдено".
/// </summary>
public sealed class NotFoundException : Exception
{
    /// <summary>
    /// Создает исключение для сущности <paramref name="entityName" /> с идентификатором <paramref name="id" />.
    /// </summary>
    public NotFoundException(string entityName, object id)
        : base($"{entityName} {id} not found")
    {
    }
}
