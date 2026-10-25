using System.Data;
using System.Text.RegularExpressions;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Abstractions.Driving.Models;
using Server.Domain.Product;

namespace Server.Application;

/// <summary>
/// Сервис сценариев работы с агрегатом товара.
/// </summary>
public class ProductService
{
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly IProductRepository _productRepository;
    private readonly IProductQueries _productQueries;
    private readonly IPriceRecalculationPublisher _priceRecalculationPublisher;
    private readonly ProductDescriptionSanitizer _descriptionSanitizer;

    /// <summary>
    /// Создает сервис сценариев работы с товарами.
    /// </summary>
    public ProductService(
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IProductRepository productRepository,
        IProductQueries productQueries,
        IPriceRecalculationPublisher priceRecalculationPublisher,
        ProductDescriptionSanitizer descriptionSanitizer)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _productRepository = productRepository;
        _productQueries = productQueries;
        _priceRecalculationPublisher = priceRecalculationPublisher;
        _descriptionSanitizer = descriptionSanitizer;
    }

    /// <summary>
    /// Инициирует пересчет цен всех лотов товара.
    /// </summary>
    public async Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await _priceRecalculationPublisher.PublishForProductAsync(unitOfWork, productId, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Создает новый товар.
    /// </summary>
    public async Task<Product> CreateProductAsync(
        string name,
        int weight,
        IReadOnlyList<string> searchQueries,
        IReadOnlyList<string> ruSearchQueries,
        string? description,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var product = Product.Create(
            name: name,
            weight: weight,
            searchQueries: searchQueries,
            ruSearchQueries: ruSearchQueries,
            description: _descriptionSanitizer.Sanitize(description));

        await _productRepository.AddAsync(unitOfWork, aggregate: product, cancellationToken: cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken: cancellationToken);
        return product;
    }

    /// <summary>
    /// Обновляет товар и инициирует обработку доменных событий агрегата.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если товар не найден.</returns>
    public async Task<OneOf<Success, NotFound>> UpdateProductAsync(
        Guid productId,
        string name,
        int weight,
        IReadOnlyList<SearchQueryWithId> searchQueries,
        IReadOnlyList<SearchQueryWithId> ruSearchQueries,
        string? description,
        CancellationToken cancellationToken
    )
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var product = await _productRepository.GetByIdAsync(unitOfWork, id: productId, cancellationToken: cancellationToken);
        if (product is null)
        {
            return new NotFound();
        }

        product.Update(
            name: name,
            weight: weight,
            searchQueries: searchQueries,
            ruSearchQueries: ruSearchQueries,
            description: _descriptionSanitizer.Sanitize(description));

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Удаляет товар по идентификатору.
    /// </summary>
    public async Task DeleteProductAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await _productRepository.RemoveAsync(unitOfWork, id, cancellationToken);
    }

    /// <summary>
    /// Обновляет время последней проверки товара.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если товар не найден.</returns>
    public async Task<OneOf<Success, NotFound>> MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var product = await _productRepository.GetByIdAsync(unitOfWork, id, cancellationToken);
        if (product is null)
        {
            return new NotFound();
        }

        product.MarkAsChecked();

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Возвращает информацию о товаре.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если товар не найден.</returns>
    public async Task<OneOf<ProductInfoView, NotFound>> GetProductAsync(Guid id, CancellationToken cancellationToken) =>
        await _productQueries.GetProductAsync(id, cancellationToken) is { } product
            ? Map(product)
            : new NotFound();

    private static ProductInfoView Map(ProductInfo product)
    {
        return new ProductInfoView(
            Data: product,
            IsCheckRequired: DateTimeOffset.UtcNow - product.LastCheckTime > TimeSpan.FromDays(WellKnown.RecheckTimeInDays),
            CalculatedEbayWeight: (int)Math.Ceiling(product.Weight * WellKnown.EbayWeightMultiplier / 100.0),
            ProductRegex: GetProductRegex(product),
            // TODO: "interesting product" is a business rule; move it into Server.Domain next to the product model.
            IsInteresting: product.CalculationResult?.RevenueAvg > WellKnown.IsInterestingRevenueUsd &&
                           product.CalculationResult?.QuantityTotal >= WellKnown.IsInterestingRelevantStatistics
        );
    }

    /// <summary>
    /// Возвращает список всех товаров.
    /// </summary>
    public async Task<IEnumerable<ProductInfoView>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        var result = await _productQueries.GetAllProductsAsync(cancellationToken);
        return result.Select(Map);
    }

    private static readonly (string From, string To)[] SimpleReplacements =
    [
        ("\\", "/"),
        ("(", "\\("),
        (")", "\\)"),
        ("/", @"[/\\]"),
        (".", ","),
        (",", "[,.]"),
    ];

    private static readonly (Regex Pattern, string Replacement)[] RegexReplacements =
    [
        (new Regex("[- ]"), "[- ]?"),
        (new Regex("[aа]"), "[aа]"),
        (new Regex("[cс]"), "[cс]"),
        (new Regex("[pр]"), "[pр]"),
        (new Regex("[eе]"), "[eе]"),
        (new Regex("[oо]"), "[oо]"),
        (new Regex("[xх]"), "[xх]"),
        (new Regex("[yу]"), "[yу]"),
        (new Regex("[bв]"), "[bв]"),
        (new Regex("[hн]"), "[hн]"),
        (new Regex("[kк]"), "[kк]"),
        (new Regex("[mм]"), "[mм]"),
        (new Regex("[l]"), "[lл]"),
        (new Regex("[tт]"), "[tт]")
    ];

    private static readonly Dictionary<string, string> DigitReplacements = new()
    {
        { "0", "[- ]?[0оo][- ]?" },
        { "1", "[- ]?1[- ]?" },
        { "2", "[- ]?2[- ]?" },
        { "3", "[- ]?[3з][- ]?" },
        { "4", "[- ]?4[- ]?" },
        { "5", "[- ]?5[- ]?" },
        { "6", "[- ]?6[- ]?" },
        { "7", "[- ]?7[- ]?" },
        { "8", "[- ]?8[- ]?" },
        { "9", "[- ]?9[- ]?" }
    };

    // TODO: the product search pattern (how a product's name and search queries match free text) is domain knowledge;
    // move it with its replacement tables into Server.Domain so sale advertisement matching does not depend on ProductService.
    internal static Regex GetProductRegex(ProductInfo productInfo)
    {
        var productNames = new HashSet<string>
        {
            productInfo.Name
        };

        foreach (var ruSearchQuery in productInfo.RuSearchQueries)
        {
            productNames.Add(ruSearchQuery.Query);
        }

        var processed = productNames.Select(word =>
        {
            var w = word.ToLowerInvariant().Trim();

            // Simple string replacements
            foreach (var (from, to) in SimpleReplacements)
            {
                w = w.Replace(from, to);
            }

            // Regex replacements
            foreach (var (pattern, replacement) in RegexReplacements)
            {
                w = pattern.Replace(w, replacement);
            }

            // Digits replacements
            foreach (var kvp in DigitReplacements)
            {
                w = w.Replace(kvp.Key, kvp.Value);
            }

            return w;
        });

        var pattern =
            $"(?:^|\\b|[\\s\\.,\\(\\)\"\\-_])({string.Join("|", processed)})(?:$|\\b|[\\s\\-,:;=\\(\\)\\.\"_])";

        return new Regex(pattern, RegexOptions.IgnoreCase);
    }
}