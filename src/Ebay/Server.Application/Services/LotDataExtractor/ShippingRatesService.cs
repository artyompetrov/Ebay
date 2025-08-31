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
        var zone1Countries = new List<ShippingCountry>
        {
            new("Таджикистан", "TJK", "TJ"),
            new("Туркменистан", "TKM", "TM"),
            new("Узбекистан", "UZB", "UZ"),
            new("Кыргызстан", "KGZ", "KG"),
        };

        // не интересно
        var zone2Countries = new List<ShippingCountry>
        {
            new("Азербайджан", "AZE", "AZ"),
            new("Молдова", "MDA", "MD"),
            new("Беларусь", "BLR", "BY"),
            new("Украина", "UKR", "UA"),
            new("Россия", "RUS", "RU"),
        };

        var zone3Countries = new List<ShippingCountry>
        {
            new("Грузия", "GEO", "GE"),
            new("Австрия", "AUT", "AT"),
            new("Дания", "GRL", "DK"),
            new("Гренландия", "DNK", "GL"),
            new("Сербия", "SRB", "RS"),
            new("Албания", "ALB", "AL"),
            new("Мальта", "MLT", "MT"),
            new("Сирия", "SYR", "SY"),
            new("Словакия", "SVK", "SK"),
            new("Словения", "SVN", "SI"),
            new("Йемен", "YEM", "YE"),
            new("Израиль", "ISR", "IL"),
            new("Армения", "ARM", "AM"),
            new("Индия", "IND", "IN"),
            new("Монголия", "MNG", "MN"),
            new("Иордания", "JOR", "JO"),
            new("Ирак", "IRQ", "IQ"),
            new("Иран", "IRN", "IR"),
            new("Ирландия", "IRL", "IE"),
            new("Непал", "NPL", "NP"),
            new("Бахрейн", "BHR", "BH"),
            new("Исландия", "ISL", "IS"),
            new("Испания", "ESP", "ES"),
            new("Андора", "AND", "AD"),
            new("Италия", "ITA", "IT"),
            new("Сан-Марино", "SMR", "SM"),
            new("Нидерланды", "NLD", "NL"),
            new("Бельгия", "BEL", "BE"),
            new("Болгария", "BGR", "BG"),
            new("Норвегия", "NOR", "NO"),
            new("Шпицберген и Ян-Майен", "SJM", "SJ"),
            new("Босния и Герцеговина", "BIH", "BA"),
            new("Катар", "QAT", "QA"),
            new("Турция", "TUR", "TR"),
            new("Кипр", "CYP", "CY"),
            new("ОАЭ", "ARE", "AE"),
            new("Китай", "CHN", "CN"),
            new("Тайвань", "TWN", "TW"),
            new("Аландские острова", "ALA", "AX"),
            new("Оман", "OMN", "OM"),
            new("Палестина", "PSE", "PS"),
            new("Ватикан", "VAT", "VA"),
            new("КНДР", "PRK", "KP"),
            new("Финляндия", "FIN", "FI"),
            new("Великобритания", "GBR", "GB"),
            new("Гернси", "GGY", "GG"),
            new("Джерси", "JEY", "JE"),
            new("Южная Корея", "KOR", "KR"),
            new("Венгрия", "HUN", "HU"),
            new("Франция", "FRA", "FR"),
            new("Монако", "MCO", "MC"),
            new("Хорватия", "HRV", "HR"),
            new("Кувейт", "KWT", "KW"),
            new("Польша", "POL", "PL"),
            new("Черногория", "MNE", "ME"),
            new("Португалия", "PRT", "PT"),
            new("Чехия", "CZE", "CZ"),
            new("Латвия", "LVA", "LV"),
            new("Швейцария", "CHE", "CH"),
            new("Румыния", "ROU", "RO"),
            new("Швеция", "SWE", "SE"),
            new("Ливан", "LBN", "LB"),
            new("Литва", "LTU", "LT"),
            new("Люксембург", "LUX", "LU"),
            new("Саудовская Аравия", "SAU", "SA"),
            new("Германия", "DEU", "DE"),
            new("Лихтенштейн", "LIE", "LI"),
            new("Эстония", "EST", "EE"),
            new("Гибралтар", "GIB", "GI"),
            new("Греция", "GRC", "GR"),
            new("Северная Македония", "MKD", "MK"),
            new("Япония", "JPN", "JP"),
        };

        var zone4Countries = new List<ShippingCountry>
        {
            new("США", "USA", "US"),
            new("Гуам", "GUM", "GU"),
            new("Маршалловы Острова", "MHL", "MH"),
            new("Палау", "PLW", "PW"),
            new("Американское Самоа", "ASM", "AS"),
            new("Пуэрто-Рико", "PRI", "PR"),
            new("Виргинские Острова (США)", "VIR", "VI"),
            new("Афганистан", "AFG", "AF"),
            new("Мьянма", "MMR", "MM"),
            new("Таиланд", "THA", "TH"),
            new("Бангладеш", "BGD", "BD"),
            new("Камбоджа", "KHM", "KH"),
            new("Канада", "CAN", "CA"),
            new("Бутан", "BTN", "BT"),
            new("Пакистан", "PAK", "PK"),
            new("Вьетнам", "VNM", "VN"),
            new("Лаос", "LAO", "LA"),
            new("Гонконг", "HKG", "HK"),
            new("Макао", "MAC", "MO"),
        };

        var zone5Countries = new List<ShippingCountry>
        {
            new("Австралия", "AUS", "AU"),
            new("Малави", "MWI", "MW"),
            new("Сент-Винсент и Гренадины", "VCT", "VC"),
            new("Малайзия", "MYS", "MY"),
            new("Сент-Люсия", "LCA", "LC"),
            new("Джибути", "DJI", "DJ"),
            new("Мали", "MLI", "ML"),
            new("Доминика", "DMA", "DM"),
            new("Мальдивы", "MDV", "MV"),
            new("Сингапур", "SGP", "SG"),
            new("Алжир", "DZA", "DZ"),
            new("Доминиканская Республика", "DOM", "DO"),
            new("Ангилья", "AIA", "AI"),
            new("Египет", "EGY", "EG"),
            new("Марокко", "MAR", "MA"),
            new("Ангола", "AGO", "AO"),
            new("Замбия", "ZMB", "ZM"),
            new("Мартиника", "MTQ", "MQ"),
            new("Антигуа и Барбуда", "ATG", "AG"),
            new("Зимбабве", "ZWE", "ZW"),
            new("Мексика", "MEX", "MX"),
            new("Сомали", "SOM", "SO"),
            new("Нидерландские Антиллы (устар.)", "ANT", "AN"),
            new("Мозамбик", "MOZ", "MZ"),
            new("Судан", "SDN", "SD"),
            new("Аргентина", "ARG", "AR"),
            new("Уругвай", "URU", "UY"),
            new("Суринам", "SUR", "SR"),
            new("Аруба", "ABW", "AW"),
            new("Индонезия", "IDN", "ID"),
            new("Монтсеррат", "MSR", "MS"),
            new("Сьерра-Леоне", "SLE", "SL"),
            new("Багамы", "BHS", "BS"),
            new("Намибия", "NAM", "NA"),
            new("Науру", "NRU", "NR"),
            new("Танзания", "TZA", "TZ"),
            new("Барбадос", "BRB", "BB"),
            new("Тимор-Лешти", "TLS", "TL"),
            new("Нигер", "NER", "NE"),
            new("Того", "TGO", "TG"),
            new("Нигерия", "NGA", "NG"),
            new("Тонга", "TON", "TO"),
            new("Белиз", "BLZ", "BZ"),
            new("Тринидад и Тобаго", "TTO", "TT"),
            new("Кабо-Верде", "CPV", "CV"),
            new("Никарагуа", "NIC", "NI"),
            new("Остров Святой Елены", "SHN", "SH"),
            new("Бенин", "BEN", "BJ"),
            new("Каймановы острова", "CYM", "KY"),
            new("Новая Зеландия", "NZL", "NZ"),
            new("Острова Кука", "COK", "CK"),
            new("Ниуэ", "NIU", "NU"),
            new("Тувалу", "TUV", "TV"),
            new("Бермуды", "BMU", "BM"),
            new("Новая Каледония", "NCL", "NC"),
            new("Тунис", "TUN", "TN"),
            new("Камерун", "CMR", "CM"),
            new("Боливия", "BOL", "BO"),
            new("Остров Вознесения", "SHN", "AC"),
            new("Туркс и Кайкос", "TCA", "TC"),
            new("Коморы", "COM", "KM"),
            new("Ботсвана", "BWA", "BW"),
            new("Кения", "KEN", "KE"),
            new("Уганда", "UGA", "UG"),
            new("Бразилия", "BRA", "BR"),
            new("Соломоновы острова", "SLB", "SB"),
            new("Бруней", "BRN", "BN"),
            new("Кирибати", "KIR", "KI"),
            new("Буркина-Фасо", "BFA", "BF"),
            new("Уоллис и Футуна", "WLF", "WF"),
            new("Бурунди", "BDI", "BI"),
            new("Колумбия", "COL", "CO"),
            new("Уругвай", "URY", "UY"),
            new("Конго", "COG", "CG"),
            new("Фиджи", "FJI", "FJ"),
            new("Вануату", "VUT", "VU"),
            new("ДР Конго", "COD", "CD"),
            new("Филиппины", "PHL", "PH"),
            new("Микронезия", "FSM", "FM"),
            new("Панама", "PAN", "PA"),
            new("Папуа - Новая Гвинея", "PNG", "PG"),
            new("Фолклендские острова", "FLK", "FK"),
            new("Коста-Рика", "CRI", "CR"),
            new("Парагвай", "PRY", "PY"),
            new("Венесуэла", "VEN", "VE"),
            new("Кот-д’Ивуар", "CIV", "CI"),
            new("Перу", "PER", "PE"),
            new("Виргинские острова (Брит.)", "VGB", "VG"),
            new("Куба", "CUB", "CU"),
            new("Питкэрн", "PCN", "PN"),
            new("ЦАР", "CAF", "CF"),
            new("Французская Полинезия", "PYF", "PF"),
            new("Чад", "TCD", "TD"),
            new("Габон", "GAB", "GA"),
            new("Гайана", "GUY", "GY"),
            new("Кюрасао", "CUW", "CW"),
            new("Французская Гвиана", "GUF", "GF"),
            new("Реюньон", "REU", "RE"),
            new("Чили", "CHL", "CL"),
            new("Гаити", "HTI", "HT"),
            new("Гамбия", "GMB", "GM"),
            new("Лесото", "LSO", "LS"),
            new("Руанда", "RWA", "RW"),
            new("Гана", "GHA", "GH"),
            new("Либерия", "LBR", "LR"),
            new("Гваделупа", "GLP", "GP"),
            new("Сальвадор", "SLV", "SV"),
            new("Шри-Ланка", "LKA", "LK"),
            new("Гватемала", "GTM", "GT"),
            new("Ливия", "LBY", "LY"),
            new("Самоа", "WSM", "WS"),
            new("Эквадор", "ECU", "EC"),
            new("Гвинея", "GIN", "GN"),
            new("Сан-Томе и Принсипи", "STP", "ST"),
            new("Экваториальная Гвинея", "GNQ", "GQ"),
            new("Гвинея-Бисау", "GNB", "GW"),
            new("Эритрея", "ERI", "ER"),
            new("Маврикий", "MUS", "MU"),
            new("Свазиленд (Eswatini)", "SWZ", "SZ"),
            new("Мавритания", "MRT", "MR"),
            new("Сейшелы", "SYC", "SC"),
            new("Эфиопия", "ETH", "ET"),
            new("Гондурас", "HND", "HN"),
            new("Мадагаскар", "MDG", "MG"),
            new("Сенегал", "SEN", "SN"),
            new("ЮАР", "ZAF", "ZA"),
            new("Майотта", "MYT", "YT"),
            new("Сен-Мартен", "MAF", "MF"),
            new("Южный Судан", "SSD", "SS"),
            new("Гренада", "GRD", "GD"),
            new("Сен-Пьер и Микелон", "SPM", "PM"),
            new("Ямайка", "JAM", "JM"),
            new("Сент-Китс и Невис", "KNA", "KN"),
            new("Западная Сахара", "ESH", "EH"),
            
        };

        _rates =
        [
            new(
                name: "Мелкий пакет авиа",
                currency: WellKnown.Currencies.KZT,
                rates: new List<ShippingRates>
                {
                    new(
                        postZone: null,
                        rates:
                        [
                            new(minWeight: 0, maxWeight: 500, price: 8_960),
                            new(minWeight: 500, maxWeight: 1000, price: 15_400),
                            new(minWeight: 1000, maxWeight: 2000, price: 27_462)
                        ],
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
                        postZone: 3,
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
                        }.Concat(CalculateForBigParcels(71_400, 6_600)).ToList(),
                        // тут зона 1 и 2, т.к. актуализировать тарифы для 1 и 2 зоны не хочется
                        specifiedCountries: zone3Countries.Union(zone1Countries).Union(zone2Countries).ToList()
                    ),

                    // зона 4
                    new(
                        postZone: 4,
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
                        }.Concat(CalculateForBigParcels(87_150, 7_920)).ToList(),
                        specifiedCountries: zone4Countries
                    ),

                    // зона 5
                    new(
                        postZone: 5,
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
                        }.Concat(CalculateForBigParcels(120_600, 11_325)).ToList(),
                        specifiedCountries: zone5Countries
                    )
                ]
            )

        ];

        _shippingRatesDictionary = GetShippingRatesDictionaryInner();
    }

    private static IEnumerable<ShippingRate> CalculateForBigParcels(int lastValueInTable, int eachAdditional)
    {
        return Enumerable.Range(10, 30).Select(x => new ShippingRate(
            minWeight: x * 1000,
            maxWeight: (x + 1) * 1000,
            price: lastValueInTable + (x - 9) * eachAdditional
        ));
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

                            rates.AppendOrCreateNewCollection(key: specifiedCountry.TwoLetterCode, value: new ShippingRateInner(
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
