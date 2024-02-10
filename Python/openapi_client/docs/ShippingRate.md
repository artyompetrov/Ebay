# ShippingRate


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**min_weight** | **int** |  | 
**max_weight** | **int** |  | 
**price** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.shipping_rate import ShippingRate

# TODO update the JSON string below
json = "{}"
# create an instance of ShippingRate from a JSON string
shipping_rate_instance = ShippingRate.from_json(json)
# print the JSON string representation of the object
print ShippingRate.to_json()

# convert the object into a dict
shipping_rate_dict = shipping_rate_instance.to_dict()
# create an instance of ShippingRate from a dict
shipping_rate_form_dict = shipping_rate.from_dict(shipping_rate_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


