# ShippingType


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**currency** | **str** |  | 
**rates** | [**List[ShippingRates]**](ShippingRates.md) |  | 

## Example

```python
from openapi_client.models.shipping_type import ShippingType

# TODO update the JSON string below
json = "{}"
# create an instance of ShippingType from a JSON string
shipping_type_instance = ShippingType.from_json(json)
# print the JSON string representation of the object
print ShippingType.to_json()

# convert the object into a dict
shipping_type_dict = shipping_type_instance.to_dict()
# create an instance of ShippingType from a dict
shipping_type_form_dict = shipping_type.from_dict(shipping_type_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


