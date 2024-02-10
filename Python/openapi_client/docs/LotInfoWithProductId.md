# LotInfoWithProductId


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**product_id** | **str** |  | 
**lot_info** | [**LotInfo**](LotInfo.md) |  | 

## Example

```python
from openapi_client.models.lot_info_with_product_id import LotInfoWithProductId

# TODO update the JSON string below
json = "{}"
# create an instance of LotInfoWithProductId from a JSON string
lot_info_with_product_id_instance = LotInfoWithProductId.from_json(json)
# print the JSON string representation of the object
print LotInfoWithProductId.to_json()

# convert the object into a dict
lot_info_with_product_id_dict = lot_info_with_product_id_instance.to_dict()
# create an instance of LotInfoWithProductId from a dict
lot_info_with_product_id_form_dict = lot_info_with_product_id.from_dict(lot_info_with_product_id_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


