using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain
{
    public class Currency
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string CurrencyEbayName { get; set; } = null!;

        public string CurrencyRusName { get; set; } = null!;

        public string CurrencyApiName { get; set; } = null!;

        /// <summary>
        /// Цена одного доллара в данной валюте
        /// </summary>
        public double CurrencyRate { get; set; }

        public DateTime LastUpdate { get; set; }
    }
}