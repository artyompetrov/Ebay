namespace Server.Application;

/// <summary>
/// Константы application-слоя.
/// </summary>
public static class WellKnown
{
    /// <summary>
    /// Время проверки товаров на ebay
    /// </summary>
    public const int RecheckTimeInDays = 360 * 2;

    /// <summary>
    /// Сумма выручки за штуку от которой интересно работать с товаром
    /// </summary>
    public const int IsInterestingRevenueUsd = 12;

    /// <summary>
    /// Количество штук на ebay продано минимум, для репрезентативности
    /// </summary>
    public const int IsInterestingRelevantStatistics = 3;

    /// <summary>
    /// Коэффициент увеличения веса товара для расчета логистики Ebay.
    /// </summary>
    public const double EbayWeightMultiplier = 1.5;

    /// <summary>
    /// Константы обновления курсов валют.
    /// </summary>
    public static class CurrencyRate
    {
        public const string BaseCurrency = "USD";
    }

    /// <summary>
    /// Константы мониторинга объявлений о продаже и очистки истории отправленных писем по ним.
    /// </summary>
    public static class SaleAdvertisements
    {
        /// <summary>
        /// Срок хранения записи дедупликации после даты самого свежего учтённого объявления (два года):
        /// только чтобы база не копила мусор, а не чтобы повторно уведомлять о том же продавце.
        /// </summary>
        public static readonly TimeSpan RemoveAdvertisementAfter = TimeSpan.FromDays(DaysInYear * RetentionYears);

        /// <summary>
        /// Пауза после отправки письма, чтобы не упереться в ограничения SMTP-сервера.
        /// </summary>
        public static readonly TimeSpan DelayAfterEmail = TimeSpan.FromSeconds(5);

        /// <summary>
        /// Имя источника спанов мониторинга объявлений (для будущей подписки трассировки через AddSource).
        /// </summary>
        public const string ActivitySourceName = "Server.Application.SaleAdvertisements";

        private const int DaysInYear = 365;
        private const int RetentionYears = 2;
    }

    /// <summary>
    /// Константы расчета цен и комиссий eBay/Payoneer, используемые при расчете выручки лота.
    /// </summary>
    public static class Ebay
    {
        /// <summary>
        /// Скидка, применяемая к цене лота для продаж без известной цены покупки.
        /// </summary>
        public const double НеизвестнаяЦенаПродажиСкидка = 0.2;

        /// <summary>
        /// Комиссия eBay Final Value Fee.
        /// </summary>
        public const double КомиссияEbayFinalValueFee = 0.136;

        /// <summary>
        /// Комиссия eBay International Fee.
        /// </summary>
        public const double КомиссияEbayInternationalFee = 0.013;

        /// <summary>
        /// Постоянная составляющая комиссии eBay.
        /// </summary>
        public const double КомиссияEbayПостояннаяВеличина = 0.4;

        /// <summary>
        /// Множитель, учитывающий VAT в комиссии eBay.
        /// </summary>
        public const double МножительУчитывающийVat = 1.12;

        /// <summary>
        /// Комиссия Payoneer в процентах.
        /// </summary>
        public const double КомиссияPayoneerВПроцентах = 0.01;
    }
}