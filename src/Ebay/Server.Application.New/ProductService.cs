using System.Data;
using System.Text.RegularExpressions;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Abstractions.Driving.Models;
using Server.Domain.Product;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев работы с агрегатом товара.
/// </summary>
public class ProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProductRepository _productRepository;
    private readonly IProductQueries _productQueries;

    /// <summary>
    /// Создает сервис сценариев работы с товарами.
    /// </summary>
    public ProductService(
        IUnitOfWork unitOfWork,
        IProductRepository productRepository,
        IProductQueries productQueries)
    {
        _unitOfWork = unitOfWork;
        _productRepository = productRepository;
        _productQueries = productQueries;
    }

    /// <summary>
    /// Создает новый товар.
    /// </summary>
    public async Task<Product> CreateProductAsync(
        string name,
        int weight,
        IReadOnlyList<string> searchQueries,
        IReadOnlyList<string> ruSearchQueries,
        CancellationToken cancellationToken)
    {
        var product = Product.Create(
            name: name,
            weight: weight,
            searchQueries: searchQueries,
            ruSearchQueries: ruSearchQueries);

        await _productRepository.AddAsync(aggregate: product, cancellationToken: cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken: cancellationToken);
        return product;
    }

    /// <summary>
    /// Обновляет товар и инициирует обработку доменных событий агрегата.
    /// </summary>
    public async Task UpdateProductAsync(
        Guid productId,
        string name,
        int weight,
        IReadOnlyList<SearchQueryWithId> searchQueries,
        IReadOnlyList<SearchQueryWithId> ruSearchQueries,
        CancellationToken cancellationToken
    )
    {
        var product = await _productRepository.GetByIdAsync(id: productId, cancellationToken: cancellationToken) ??
                      throw new InvalidOperationException("product not found");
        product.Update(name: name, weight: weight, searchQueries: searchQueries, ruSearchQueries: ruSearchQueries);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Удаляет товар по идентификатору.
    /// </summary>
    public async Task DeleteProductAsync(
        Guid id,
        CancellationToken cancellationToken) => await _productRepository.RemoveAsync(id, cancellationToken);

    /// <summary>
    /// Обновляет время последней проверки товара.
    /// </summary>
    public async Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken) ??
                      throw new InvalidOperationException("Product not found");
        product.MarkAsChecked();

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Возвращает информацию о товаре.
    /// </summary>
    public async Task<ProductInfoView?> GetProductAsync(Guid id, CancellationToken cancellationToken)
    {

        var product = await _productQueries.GetProductAsync(id, cancellationToken);

        if (product == null)
            return null;

        return Map(product);
    }

    private static ProductInfoView Map(ProductInfo product)
    {
        return new ProductInfoView(
            Data: product,
            IsCheckRequired: DateTimeOffset.UtcNow - product.LastCheckTime > TimeSpan.FromDays(WellKnown.RecheckTimeInDays),
            CalculatedEbayWeight: (int)Math.Ceiling(product.Weight * WellKnown.EbayWeightMultiplier / 100.0),
            ProductRegex: GetProductRegex(product),
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

    private static readonly Dictionary<string, string> SimpleReplacements = new()
    {
        { "(", "\\(" },
        { ")", "\\)" },
        { "/", "\\/" },
        { ".", "," },
        { ",", "[,.]" },
    };

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

    private static Regex GetProductRegex(ProductInfo productInfo)
    {
        var productNames = new HashSet<string>
        {
            productInfo.Name
        };

        if (productInfo.RuSearchQueries == null)
        {
            throw new InvalidOperationException($"{nameof(productInfo.RuSearchQueries)} is null");
        }

        foreach (var ruSearchQuery in productInfo.RuSearchQueries)
        {
            productNames.Add(ruSearchQuery.Query);
        }

        var processed = productNames.Select(word =>
        {
            var w = word.ToLowerInvariant().Trim();

            // Simple string replacements
            foreach (var kvp in SimpleReplacements)
            {
                w = w.Replace(kvp.Key, kvp.Value);
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