namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт процессного кеша значений, привязанных к замеру (байты фото/миниатюр, отрендеренные графики для eBay).
/// Все записи одного замера можно разом протухнуть через <see cref="Invalidate"/>, не зная их ключей.
/// </summary>
public interface IMeasurementContentCacheAdapter
{
    /// <summary>
    /// Возвращает значение из кеша либо вычисляет его через <paramref name="factory"/> и кеширует.
    /// Значение <see langword="null"/> не кешируется.
    /// </summary>
    /// <param name="measurementId">Замер, к которому привязана запись (для <see cref="Invalidate"/>).</param>
    /// <param name="key">Ключ записи.</param>
    /// <param name="factory">Вычисление значения при отсутствии его в кеше.</param>
    /// <param name="sizeSelector">Размер значения в байтах для учёта в общем лимите размера кеша.</param>
    Task<T?> GetOrCreateAsync<T>(
        string measurementId,
        string key,
        Func<Task<T?>> factory,
        Func<T, long> sizeSelector)
        where T : class;

    /// <summary>
    /// Удаляет одну запись по ключу.
    /// </summary>
    void Remove(string key);

    /// <summary>
    /// Протухивает все записи, привязанные к замеру.
    /// </summary>
    void Invalidate(string measurementId);
}
