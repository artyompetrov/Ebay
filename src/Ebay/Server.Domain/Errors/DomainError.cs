namespace Server.Domain.Errors;

/// <summary>
/// A business rule rejected the operation. Returned (never thrown) as a case of a <c>OneOf</c> result;
/// driving adapters translate it into their own answer (the Web API answers with a validation problem).
/// </summary>
/// <param name="Message">Human-readable English description of the violated rule.</param>
public sealed record DomainError(string Message);
