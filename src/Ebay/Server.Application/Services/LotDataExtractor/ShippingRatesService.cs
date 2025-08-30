using Server.Application.Infrastructure;
using Server.Controllers.Generated;

namespace Server.Application.Services.LotDataExtractor;

public class ShippingRatesService
{
    private readonly List<ShippingType> _rates;
    private readonly Dictionary<string, List<ShippingRateInner>> _shippingRatesDictionary;

    // тарифы взяты отсюда https://qazpost.kz/ru/help/tariffs?tab=pochtovye-uslugi

    public ShippingRatesService()
    {

        // не интересно
        var zone1Countries = new HashSet<string>
        {
            "TJ", // Таджикистан
            "TM", // Туркменистан
            "UZ", // Узбекистан
            "KG", // Кыргызстан
        };

        // не интересно
        var zone2Countries = new HashSet<string>
        {
            "AZ", // Азербайджан
            "MD", // Молдова
            "BY", // Беларусь
            "UA", // Украина
            "RU", // Россия
        };

        var zone3Countries = new HashSet<string>
        {
            "GE", // Грузия
            "AT", // Австрия
            "DK", // Дания
            "RS", // Сербия
            "AL", // Албания
            "MT", // Мальта
            "SY", // Сирия
            "SK", // Словакия
            "SI", // Словения
            "YE", // Йемен
            "IL", // Израиль
            "AM", // Армения
            "IN", // Индия
            "MN", // Монголия
            "JO", // Иордания
            "IQ", // Ирак
            "IR", // Иран
            "IE", // Ирландия
            "NP", // Непал
            "BH", // Бахрейн
            "IS", // Исландия
            "ES", // Испания
            "IT", // Италия
            "NL", // Нидерланды
            "BE", // Бельгия
            "BG", // Болгария
            "NO", // Норвегия
            "BA", // Босния и Герцеговина
            "QA", // Катар
            "TR", // Турция
            "CY", // Кипр
            "AE", // Объединённые Арабские Эмираты
            "CN", // Китай
            "AX", // Аландские о-ва
            "OM", // Оман
            "PS", // Палестина
            "VA", // Ватикан
            "KP", // Корея Северная
            "FI", // Финляндия
            "GB", // Великобритания
            "KR", // Корея Южная
            "HU", // Венгрия
            "FR", // Франция
            "HR", // Хорватия
            "KW", // Кувейт
            "PL", // Польша
            "ME", // Черногория
            "PT", // Португалия
            "CZ", // Чехия
            "LV", // Латвия
            "CH", // Швейцария
            "RO", // Румыния
            "SE", // Швеция
            "LB", // Ливан
            "LT", // Литва
            "LU", // Люксембург
            "SA", // Саудовская Аравия
            "DE", // Германия
            "EE", // Эстония
            "GI", // Гибралтар
            "GR", // Греция
            "MK", // Северная Македония
            "JP", // Япония
        };

        var zone4Countries = new HashSet<string>
        {
            "US", // США
            "AF", // Афганистан
            "MM", // Мьянма (Бирма)
            "TH", // Таиланд
            "BD", // Бангладеш
            "KH", // Камбоджа
            "CA", // Канада
            "BT", // Бутан
            "PK", // Пакистан
            "VN", // Вьетнам
            "LA", // Лаос
            "HK", // Гонконг (Китай)
            "MO", // Макао (Китай)
        };

        var zone5Countries = new HashSet<string>
        {
            "AU", // Австралия
            "MW", // Малави
            "VC", // Сент-Винсент и Гренадины
            "MY", // Малайзия
            "LC", // Сент-Люсия
            "DJ", // Джибути
            "ML", // Мали
            "DM", // Доминика
            "MV", // Мальдивы
            "SG", // Сингапур
            "DZ", // Алжир
            "DO", // Доминиканская Республика
            "AI", // Ангилья
            "EG", // Египет
            "MA", // Марокко
            "AO", // Ангола
            "ZM", // Замбия
            "MQ", // Мартиника
            "AG", // Антигуа и Барбуда
            "ZW", // Зимбабве
            "MX", // Мексика
            "SO", // Сомали
            "AN", // Нидерландские Антиллы (устар., заменены на BQ, CW, SX)
            "MZ", // Мозамбик
            "SD", // Судан
            "AR", // Аргентина
            "SR", // Суринам
            "AW", // Аруба
            "ID", // Индонезия
            "MS", // Монтсеррат
            "SL", // Сьерра-Леоне
            "BS", // Багамы
            "NA", // Намибия
            "NR", // Науру
            "TZ", // Танзания
            "BB", // Барбадос
            "TL", // Тимор-Лешти
            "NE", // Нигер
            "TG", // Того
            "NG", // Нигерия
            "TO", // Тонга
            "BZ", // Белиз
            "TT", // Тринидад и Тобаго
            "CV", // Кабо-Верде
            "NI", // Никарагуа
            "SH", // Тристан-да-Кунья (входит в SH)
            "BJ", // Бенин
            "KY", // Каймановы острова
            "NZ", // Новая Зеландия
            "TV", // Тувалу
            "BM", // Бермуды
            "NC", // Новая Каледония
            "TN", // Тунис
            "CM", // Камерун
            "BO", // Боливия
            "AC", // о. Вознесения (часть SH)
            "TC", // Туркс и Кайкос
            "KM", // Коморы
            "BW", // Ботсвана
            "KE", // Кения
            "SH", // о. Святой Елены
            "UG", // Уганда
            "BR", // Бразилия
            "SB", // Соломоновы острова
            "BN", // Бруней
            "KI", // Кирибати
            "BF", // Буркина-Фасо
            "WF", // Уоллис и Футуна
            "BI", // Бурунди
            "CO", // Колумбия
            "UY", // Уругвай
            "CG", // Конго
            "FJ", // Фиджи
            "VU", // Вануату
            "CD", // Конго (ДРК)
            "PH", // Филиппины
            "PA", // Панама
            "PG", // Папуа — Новая Гвинея
            "FK", // Фолклендские острова
            "CR", // Коста-Рика
            "PY", // Парагвай
            "VE", // Венесуэла
            "CI", // Кот-д’Ивуар
            "PE", // Перу
            "VG", // Виргинские острова (Брит.)
            "CU", // Куба
            "PN", // Питкэрн
            "CF", // Центральноафриканская Республика
            "PF", // Французская Полинезия
            "TD", // Чад
            "GA", // Габон
            "GY", // Гайана
            "CW", // Кюрасао
            "GF", // Французская Гвиана
            "RE", // Реюньон
            "CL", // Чили
            "HT", // Гаити
            "CL", // Чили — о. Пасхи (тот же код, входит в CL)
            "GM", // Гамбия
            "LS", // Лесото
            "RW", // Руанда
            "GH", // Гана
            "LR", // Либерия
            "GP", // Гваделупа
            "SV", // Сальвадор
            "LK", // Шри-Ланка
            "GT", // Гватемала
            "LY", // Ливия
            "WS", // Самоа
            "EC", // Эквадор
            "GN", // Гвинея
            "ST", // Сан-Томе и Принсипи
            "GQ", // Экваториальная Гвинея
            "GW", // Гвинея-Бисау
            "ER", // Эритрея
            "MU", // Маврикий
            "SZ", // Свазиленд (ныне Eswatini, код остался SZ)
            "MR", // Мавритания
            "SC", // Сейшелы
            "ET", // Эфиопия
            "HN", // Гондурас
            "MG", // Мадагаскар
            "SN", // Сенегал
            "ZA", // ЮАР
            "YT", // Майотта
            "MF", // Сен-Мартен
            "SS", // Южный Судан
            "GD", // Гренада
            "PM", // Сен-Пьер и Микелон
            "JM", // Ямайка
            "KN", // Сент-Китс и Невис
        };

        _rates =
        [
            new(
                name: "Мелкий пакет авиа",
                currency: WellKnown.Currencies.KZT,
                rates: new List<ShippingRates>
                {
                    new(
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 500, price: 8_960),
                            new(minWeight: 500, maxWeight: 1000, price: 15_400),
                            new(minWeight: 1000, maxWeight: 2000, price: 27_462),
                        },
                        specifiedCountries: null
                    )
                }
            ),

            new(
                name: "Посылка авиа",
                currency: WellKnown.Currencies.KZT,
                rates:
                [
                    // зона 3
                    new(
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 2000, price: 16_950),
                            new(minWeight: 2000, maxWeight: 3000, price: 24_225),
                            new(minWeight: 3000, maxWeight: 4000, price: 30_825),
                            new(minWeight: 4000, maxWeight: 5000, price: 37_725),
                            new(minWeight: 5000, maxWeight: 6000, price: 44_400),
                            new(minWeight: 6000, maxWeight: 7000, price: 51_150),
                            new(minWeight: 7000, maxWeight: 8000, price: 57_900),
                            new(minWeight: 8000, maxWeight: 9000, price: 64_875),
                            new(minWeight: 9000, maxWeight: 10000, price: 71_400),
                        }.Concat(
                            Enumerable.Range(10, 30).Select(x => new ShippingRate(
                                minWeight: x * 1000,
                                maxWeight: (x + 1) * 1000,
                                price: 71_400 + (x - 9) * 6_600
                            ))
                        ).ToList(),
                        specifiedCountries: zone3Countries.ToList()
                    ),
    
                    // зона 4
                    new(
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 2000, price: 17_175),
                            new(minWeight: 2000, maxWeight: 3000, price: 26_475),
                            new(minWeight: 3000, maxWeight: 4000, price: 35_175),
                            new(minWeight: 4000, maxWeight: 5000, price: 44_100),
                            new(minWeight: 5000, maxWeight: 6000, price: 52_650),
                            new(minWeight: 6000, maxWeight: 7000, price: 61_125),
                            new(minWeight: 7000, maxWeight: 8000, price: 70_200),
                            new(minWeight: 8000, maxWeight: 9000, price: 78_450),
                            new(minWeight: 9000, maxWeight: 10000, price: 87_150),
                        }.Concat(
                            Enumerable.Range(10, 30).Select(x => new ShippingRate(
                                minWeight: x * 1000,
                                maxWeight: (x + 1) * 1000,
                                price: 87_150 + (x - 9) * 7_920
                            ))
                        ).ToList(),
                        specifiedCountries: zone4Countries.ToList()
                    ),

                    // зона 5
                    new(
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 2000, price: 19_800),
                            new(minWeight: 2000, maxWeight: 3000, price: 33_375),
                            new(minWeight: 3000, maxWeight: 4000, price: 45_975),
                            new(minWeight: 4000, maxWeight: 5000, price: 58_200),
                            new(minWeight: 5000, maxWeight: 6000, price: 70_500),
                            new(minWeight: 6000, maxWeight: 7000, price: 82_950),
                            new(minWeight: 7000, maxWeight: 8000, price: 95_700),
                            new(minWeight: 8000, maxWeight: 9000, price: 108_300),
                            new(minWeight: 9000, maxWeight: 10000, price: 120_600),
                        }.Concat(
                            Enumerable.Range(10, 30).Select(x => new ShippingRate(
                                minWeight: x * 1000,
                                maxWeight: (x + 1) * 1000,
                                price: 120_600 + (x - 9) * 11_325
                            ))
                        ).ToList(),
                        specifiedCountries: zone5Countries.ToList()
                    )
                ]
            )

        ];

        _shippingRatesDictionary = GetShippingRatesDictionaryInner();
    }


    public const string Worldwide = "Worldwide";

    public IReadOnlyCollection<ShippingType> ShippingRates => _rates;

    public IReadOnlyDictionary<string, List<ShippingRateInner>> ShippingRatesDictionary => _shippingRatesDictionary;

    private Dictionary<string, List<ShippingRateInner>> GetShippingRatesDictionaryInner()
    {
        var rates = new Dictionary<string, List<ShippingRateInner>>();

        foreach (var shippingRate in ShippingRates)
        {
            foreach (var shippingRateRate in shippingRate.Rates)
            {
                if (shippingRateRate == null) throw new NullReferenceException(nameof(shippingRate));

                foreach (var rate in shippingRateRate.Rates)
                {
                    if (shippingRateRate.SpecifiedCountries == null)
                    {
                        rates.AppendOrCreateNewCollection(key: Worldwide, value: new ShippingRateInner(
                            WeightFrom: rate.MinWeight,
                            WeightTo: rate.MaxWeight,
                            Price: rate.Price,
                            Currency: shippingRate.Currency));
                    }
                    else
                    {
                        foreach (var specifiedCountry in shippingRateRate.SpecifiedCountries)
                        {
                            if (rate == null!) throw new NullReferenceException(nameof(rate));

                            rates.AppendOrCreateNewCollection(key: specifiedCountry, value: new ShippingRateInner(
                                WeightFrom: rate.MinWeight,
                                WeightTo: rate.MaxWeight,
                                Price: rate.Price,
                                Currency: shippingRate.Currency));
                        }
                    }
                }
            }
        }

        return rates;
    }


    public record struct ShippingRateInner(int WeightFrom, int WeightTo, double Price, string Currency)
    {
        public override string ToString() => $"{WeightFrom}-{WeightTo} : {Price} {Currency}";
    };

}
