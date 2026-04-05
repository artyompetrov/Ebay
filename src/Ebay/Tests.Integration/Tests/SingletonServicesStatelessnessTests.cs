using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.Integration.Tests;

/// <summary>
/// Архитектурный тест для singleton-сервисов.
///
/// Как исправлять падения:
/// 1) Поле должно быть readonly.
/// 2) Для внешних типов (не из Server.*) используйте только типы из AllowedExternalImmutableTypes.
/// 3) Если mutable-состояние в singleton действительно нужно по дизайну — пометьте класс [AllowMutable("reason")].
/// </summary>
public class SingletonServicesStatelessnessTests
{
    private const string AllowMutableAttributeFullName = "Server.Application.New.AllowMutableAttribute";

    private static readonly Type[] AllowedExternalImmutableTypes =
    [
        typeof(bool),
        typeof(byte),
        typeof(sbyte),
        typeof(short),
        typeof(ushort),
        typeof(int),
        typeof(uint),
        typeof(long),
        typeof(ulong),
        typeof(nint),
        typeof(nuint),
        typeof(float),
        typeof(double),
        typeof(decimal),
        typeof(char),
        typeof(string),
        typeof(Guid),
        typeof(DateOnly),
        typeof(TimeOnly),
        typeof(TimeSpan),
        typeof(DateTimeOffset)
    ];

    [Test]
    public void SingletonServices_MustRemainStateless_UnlessMarkedAsException()
    {
        var singletonImplementationTypes = GetSingletonImplementationTypesFromHost();

        var violations = singletonImplementationTypes
            .Where(type => !IsMarkedAsMutableException(type))
            .SelectMany(type => AnalyzeTypeRecursively(type, path: type.FullName ?? type.Name, currentPathTypes: []))
            .Distinct(StringComparer.Ordinal)
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToArray();

        Assert.That(violations, Is.Empty, BuildFailureMessage(violations));
    }

    private static string BuildFailureMessage(string[] violations)
    {
        return
            $"Singleton services must be stateless.\n" +
            $"How to fix: make field readonly; or use external type from AllowedExternalImmutableTypes; " +
            $"or mark class with {AllowMutableAttributeFullName}.\n" +
            string.Join(Environment.NewLine, violations);
    }

    private static Type[] GetSingletonImplementationTypesFromHost()
    {
        ServiceDescriptor[]? capturedDescriptors = null;

        var factory = IntegrationTestsSetupFixture.Factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureServices(services => { capturedDescriptors = services.ToArray(); });
        });

        using var client = factory.CreateClient();

        Assert.That(capturedDescriptors, Is.Not.Null, "Service descriptors should be captured during host configuration.");

        return capturedDescriptors!
            .Where(descriptor => descriptor.Lifetime == ServiceLifetime.Singleton)
            .Select(GetSingletonImplementationType)
            .Where(type => type is not null)
            .Cast<Type>()
            .Where(IsTypeFromOurAssemblies)
            .Distinct()
            .ToArray();
    }

    private static IEnumerable<string> AnalyzeTypeRecursively(
        Type type,
        string path,
        HashSet<Type> currentPathTypes)
    {
        if (!currentPathTypes.Add(type))
        {
            yield break;
        }

        try
        {
            if (IsMarkedAsMutableException(type))
            {
                yield break;
            }

            foreach (var field in GetRelevantInstanceFields(type))
            {
                var fieldPath = $"{path}.{field.Name}";

                if (!field.IsInitOnly)
                {
                    yield return $"{fieldPath} must be readonly.";
                    continue;
                }

                var normalizedFieldType = UnwrapNullable(field.FieldType);
                if (normalizedFieldType.IsEnum)
                {
                    continue;
                }

                var nestedOurTypes = GetOurTypesToAnalyze(normalizedFieldType).Distinct().ToArray();
                if (nestedOurTypes.Length > 0)
                {
                    foreach (var nestedOurType in nestedOurTypes)
                    {
                        foreach (var violation in AnalyzeTypeRecursively(nestedOurType, fieldPath, currentPathTypes))
                        {
                            yield return violation;
                        }
                    }

                    continue;
                }

                if (!IsAllowedExternalType(normalizedFieldType))
                {
                    yield return $"{fieldPath} uses non-whitelisted external type {normalizedFieldType.FullName}.";
                }
            }
        }
        finally
        {
            currentPathTypes.Remove(type);
        }
    }

    private static IEnumerable<Type> GetOurTypesToAnalyze(Type type)
    {
        if (IsTypeFromOurAssemblies(type))
        {
            yield return type;
        }

        if (!type.IsGenericType)
        {
            yield break;
        }

        foreach (var genericArgument in type.GetGenericArguments())
        {
            var normalizedGenericArgument = UnwrapNullable(genericArgument);
            if (IsTypeFromOurAssemblies(normalizedGenericArgument))
            {
                yield return normalizedGenericArgument;
            }
        }
    }

    private static Type? GetSingletonImplementationType(ServiceDescriptor descriptor)
    {
        if (descriptor.ImplementationType is not null)
        {
            return descriptor.ImplementationType;
        }

        if (descriptor.ImplementationInstance is not null)
        {
            return descriptor.ImplementationInstance.GetType();
        }

        return null;
    }

    private static bool IsMarkedAsMutableException(Type type)
    {
        return type
            .GetCustomAttributes(inherit: false)
            .Any(attribute => attribute.GetType().FullName == AllowMutableAttributeFullName);
    }

    private static FieldInfo[] GetRelevantInstanceFields(Type type)
    {
        return type
            .GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
            .Where(field => !field.IsLiteral)
            .Where(field => !field.IsDefined(typeof(System.Runtime.CompilerServices.CompilerGeneratedAttribute), inherit: false))
            .ToArray();
    }

    private static bool IsTypeFromOurAssemblies(Type type)
    {
        return type.Assembly.GetName().Name?.StartsWith("Server.", StringComparison.Ordinal) == true;
    }

    private static bool IsAllowedExternalType(Type fieldType)
    {
        if (fieldType.IsInterface || fieldType.IsAbstract)
        {
            return true;
        }

        return AllowedExternalImmutableTypes.Contains(fieldType);
    }

    private static Type UnwrapNullable(Type type)
    {
        return Nullable.GetUnderlyingType(type) ?? type;
    }
}
