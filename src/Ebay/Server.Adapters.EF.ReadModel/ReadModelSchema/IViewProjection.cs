using System.Linq.Expressions;
using JetBrains.Annotations;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

internal interface IViewProjection<TDomain, TView>
{
    [UsedImplicitly]
    static abstract Expression<Func<TDomain, TView>> ToView { get; }
}