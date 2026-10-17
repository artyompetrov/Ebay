using MassTransit;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.EF.WriteModel;

/// <summary>
/// Access to the transactional outbox of a write-model unit of work for the MassTransit adapter's publishers.
/// </summary>
public static class WriteModelOutbox
{
    /// <summary>
    /// Returns the bus-outbox publish endpoint bound to the unit of work's context: messages published through it
    /// are stored by the unit of work's next <see cref="IWriteModelUnitOfWork.SaveChangesAsync"/>.
    /// </summary>
    public static IPublishEndpoint GetPublishEndpoint(IWriteModelUnitOfWork unitOfWork) =>
        WriteModelUnitOfWork.From(unitOfWork).PublishEndpoint;
}
