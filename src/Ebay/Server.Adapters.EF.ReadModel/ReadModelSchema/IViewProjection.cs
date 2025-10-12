using System.Linq.Expressions;
using JetBrains.Annotations;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

internal interface IViewProjection<TDomain, TView>
{
    /// <summary>
    /// Для обеспечения соответствия между Read и Write моделью
    /// </summary>
    [UsedImplicitly]
    static abstract Expression<Func<TDomain, TView>> ToView { get; }
}