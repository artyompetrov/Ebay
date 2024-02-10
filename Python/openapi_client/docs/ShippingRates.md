# ShippingRates


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**specified_countries** | **List[str]** |  | [optional] 
**rates** | [**List[ShippingRate]**](ShippingRate.md) |  | 

## Example

```python
from openapi_client.models.shipping_rates import ShippingRates

# TODO update the JSON string below
json = "{}"
# create an instance of ShippingRates from a JSON string
shipping_rates_instance = ShippingRates.from_json(json)
# print the JSON string representation of the object
print ShippingRates.to_json()

# convert the object into a dict
shipping_rates_dict = shipping_rates_instance.to_dict()
# create an instance of ShippingRates from a dict
shipping_rates_form_dict = shipping_rates.from_dict(shipping_rates_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


