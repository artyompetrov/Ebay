namespace Server.Application;

internal static class WellKnown
{
    public static class Formats
    {
        public static string TimeFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
    }

    public static class Currencies
    {
        public static string KZT = "KZT";
        public static string UsDollar = "USD";
    }

    public static class Ebay
    {
        public const double скидкаНаПродажиСНеизвестнойЦеной = 0.2;
        public const double коммисияEbayFinalValueFee = 0.136;
        public const double коммисияEbayInternationalFee = 0.013;
        public const double коммиссияEbayПостояннаяВеличина = 0.4;
        public const double множительУчитывающийVat = 1.12;
        public const double коммисияPayoneerВПроцентах = 0.01;
        public const double множительДляУчетаВесаУпаковки = 1.5;
    }

    public static class DbCache
    {
        /// <summary>
        /// Версия кеша - для сброса кеша при изменении логики расчетов
        /// </summary>
        public const string Version = "14";
    }

    public static class ImageCache
    {
        public const string SectionName = "ImageCache";

        /// <summary>
        /// Максимальный суммарный размер (в байтах) записей, удерживаемых одновременно в общем
        /// кеше фото/миниатюр замеров и отрендеренных графиков для eBay.
        /// </summary>
        public const long DefaultSizeLimitBytes = 200 * 1024 * 1024;
    }
}