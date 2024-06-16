import {ApiException} from "./EbayClient/EbayClient";

export class EbayShoppingApiClient
{
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };

    constructor(http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window as any;
    }

    getShippingCosts(itemId:string, countryCode:string, postalCode: string): Promise<string> {
        let url_ = "https://open.api.ebay.com/shopping";
       
        let options_: RequestInit = {
            method: "POST",
            headers: {
                'X-EBAY-API-SITE-ID': '0',
                'X-EBAY-API-CALL-NAME': 'GetShippingCosts',
                'X-EBAY-API-REQUEST-ENCODING': 'xml',
                'X-EBAY-API-VERSION': '863'
            },
            body: `
<?xml version="1.0" encoding="utf-8"?>
<GetShippingCostsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <ItemID>${itemId}</ItemID>
  <DestinationCountryCode>${countryCode}</DestinationCountryCode>
  <DestinationPostalCode>${postalCode}</DestinationPostalCode>
  <IncludeDetails>true</IncludeDetails>
  <QuantitySold>1</QuantitySold>
</GetShippingCostsRequest>`
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetShippingCosts(_response);
        });
    }

    protected processGetShippingCosts(response: Response): Promise<string> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                return _responseText;
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                return throwException("Bad Request", status, _responseText, _headers);
            });
        } else if (status === 409) {
            return response.text().then((_responseText) => {
                return throwException("Conflict", status, _responseText, _headers);
            });
        } else if (status === 500) {
            return response.text().then((_responseText) => {
                return throwException("Internal Server Error", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        
        return Promise.resolve<string>(null as any);
    }
}
function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}

