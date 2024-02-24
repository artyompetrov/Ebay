import pandas as pd
import builtins
from openapi_client import LotInfoShort, ProductWithId
from openapi_client import ApiClient, Configuration
from openapi_client.api import DefaultApi
import requests
from typing import List
import matplotlib.pyplot as plt
from datetime import datetime
import seaborn as sns
from io import BytesIO
import base64

def run_file():
    lines = []

    builtins.print_old = builtins.print

    def print(*value, sep=' ', end='\n'):
        tag = 'span'
        if end == '\n':
            if len(value) == 0:
                lines.append('<br/>')
                return
            end = '<br/>'
            tag = 'div'
        value_str = sep.join((str(v).replace('\n', '<br/>') for v in value))
        html = f"<{tag}>{value_str}{end}</{tag}>"
        lines.append(html)

    builtins.print = print

    pd.DataFrame.to_html_old = pd.DataFrame.to_html

    def df_to_html(self):
        html = self.to_html_old()
        lines.append(html)

    pd.DataFrame.to_html = df_to_html

    pd.DataFrame.__str__old = pd.DataFrame.__str__

    def df__str__to_html(self):
        html = self.__str__old()
        html = html.replace('\n', '<br/>')
        return html

    pd.DataFrame.__str__ = df__str__to_html

    def colored_to_html(text, color):
        return f'<font color="{color}">{text}</font>'

    colored = colored_to_html


    plt.show_old = plt.show

    def show_to_html():
        global plot_counter
        tmpfile = BytesIO()
        plt.savefig(tmpfile, format='png')
        encoded = base64.b64encode(tmpfile.getvalue()).decode('utf-8')
        lines.append('<div><img src=\'data:image/png;base64,{}\'></div>'.format(encoded))
        fig = plt.gcf()
        fig.clear()
        plt.close(fig)

    plt.show = show_to_html

    # css styles
    lines.append("""
	<style>
		table {
			border-collapse: collapse;
		}
	</style>
	""")

    # In[2]:


    server = "naks42.ru"
    port = 17443
    clientId = "Ebay.Python"
    secret = "ac4ab670-ae20-451a-ab4a-3a20275e807d"


    # In[3]:


    unknown_price_discount = 0.8


    # In[4]:


    def extract_check_state(x:str):
        if 'NotTested' in x:
            return 'not tested'
        if 'AndTested' in x:
            return 'tested'
        if 'AndMatched' in x:
            return 'matched'
        raise Exception ("unable to map " + x)


    # In[5]:


    def extract_state(x:str):
        if 'new' in x:
            return 'new'
        if 'used' in x:
            return 'used'
        if 'dismantled' in x:
            return 'used'
        raise Exception ("unable to map " + x)


    # In[6]:


    def calc_statistics(df):
        mean = df.purchase_total_price_usd.sum() / df.total_pcs_per_purchase.sum()
        print('Среднее: ', mean)

        sns.histplot(data=df, x='total_price_per_pcs_usd', weights=df.purchase_quantity, bins=10)
        plt.axvline(x = mean, color = 'b')
        plt.title(product.name + ' Распределение цены для new')
        plt.show()

        sns.scatterplot(data=df, x="total_price_per_pcs_usd", y="total_pcs_per_purchase", hue="check_state")
        plt.axvline(x = mean, color = 'b')
        plt.show()


    # In[7]:


    pd.set_option('display.max_columns', None)
    #pd.set_option('display.max_rows', None)
    pd.set_option('display.max_colwidth', None)
    plt.rcParams["figure.figsize"] = (10,5)

    def get_access_token(url, client_id, client_secret):
        response = requests.post(
            url,
            data={"grant_type": "client_credentials"},
            auth=(client_id, client_secret),
        )
        return response.json()["access_token"]

    token = get_access_token(f"https://{server}:{port}/connect/token", clientId, secret)

    client = ApiClient(
        configuration=Configuration(host=f'https://{server}:{port}/api/ebay/v1'), header_name='Authorization',
        header_value='Bearer ' + token)

    api = DefaultApi(client)

    currencies = api.get_currencies()
    currency_rates = {}
    for currency in currencies:
        if (datetime.now() - datetime.strptime(currencies[0].last_update, '%Y-%m-%dT%H:%M:%S.%fZ')).days > 1:
            raise Exception("exchange rate isn't accurate " + currency.ebay_name)
        currency_rates[currency.ebay_name] = currency.rate

    productRowsExcluded = {'search_queries'}
    lotRowsExcluded = {'seller', 'located_in', 'purchase_history'}
    purchaseExcluded = {}

    products: List[ProductWithId] = api.get_all_products()


    for product in products:
        if product.name != '6Н1П': continue

        print(colored('#' * 50 + f' {product.name} ' + '#' * 50, "red"))

        lots: List[LotInfoShort] = api.get_lots(product_id=product.id)

        productRow = {}
        for key, value in product.__dict__.items():
            if key not in productRowsExcluded:
                productRow[f'product_{key}'] = value

        dataFrameArray = []
        for lot in lots:
            lotRow = productRow.copy()
            for key, value in lot.__dict__.items():
                if key not in lotRowsExcluded:
                    lotRow[f'lot_{key}'] = value

            for purchase in lot.purchase_history:
                purchaseRow = lotRow.copy()
                for key, value in purchase.__dict__.items():
                    if key not in purchaseExcluded:
                        purchaseRow[f'purchase_{key}'] = value
                dataFrameArray.append(purchaseRow)

        if len(dataFrameArray) == 0:
            print("Нет продаж для лота", '\n')
            continue

        df = pd.DataFrame(dataFrameArray)

        df.lot_title_change_date = pd.to_datetime(df.lot_title_change_date)
        df.purchase_var_date = pd.to_datetime(df.purchase_var_date)
        df = df[df.purchase_var_date > df.lot_title_change_date]
        df['purchase_price_filled_nulls'] = df.purchase_price.fillna(df.lot_price * unknown_price_discount)
        df['exchange_rate'] = df.lot_currency.map(currency_rates)

        df['purchase_total_price'] = df.purchase_price_filled_nulls * df.purchase_quantity + df.lot_shipping + (df.lot_shipping_additional * (df.purchase_quantity - 1))
        df['purchase_total_price_usd'] = df.purchase_total_price / df.exchange_rate
        df['total_price_per_pcs_usd'] = df.purchase_total_price_usd / (df.lot_pcs * df.purchase_quantity)
        df['total_pcs_per_purchase'] = df.lot_pcs * df.purchase_quantity
        df['state'] = df.lot_manual_condition_id.map(extract_state)
        df['check_state'] = df.lot_manual_condition_id.map(extract_check_state)


        print('Продано штук: ', (df.purchase_quantity * df.lot_pcs).sum(), '\n')

        print('Распределение по состоянию (проданных штук): ')
        print(df.groupby('lot_manual_condition_id')['total_pcs_per_purchase'].sum().to_string(header=False), "\n")

        df_new = df[df.state == 'new']
        df_used = df[df.state == 'used']

        if df_new.shape[0] > 0:
            print('new')
            calc_statistics(df_new)

        if df_used.shape[0] > 0:
            print('used')
            calc_statistics(df_used)
        print()


    return str.join('\n', lines)
