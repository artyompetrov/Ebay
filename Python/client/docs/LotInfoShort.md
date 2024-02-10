# LotInfoShort


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**lot_id** | **int** |  | 
**name** | **str** |  | 
**pcs** | **int** |  | 
**shipping_country** | **str** |  | 
**currency** | **str** |  | 
**price** | **float** |  | 
**shipping** | **float** |  | [optional] 
**shipping_additional** | **float** |  | [optional] 
**condition** | **str** |  | 
**condition_description** | **str** |  | [optional] 
**seller** | **str** |  | 
**located_in** | **str** |  | 
**manual_condition_id** | **str** |  | 
**purchase_history** | [**List[PurchaseInfo]**](PurchaseInfo.md) |  | 

## Example

```python
from openapi_client.models.lot_info_short import LotInfoShort

# TODO update the JSON string below
json = "{}"
# create an instance of LotInfoShort from a JSON string
lot_info_short_instance = LotInfoShort.from_json(json)
# print the JSON string representation of the object
print LotInfoShort.to_json()

# convert the object into a dict
lot_info_short_dict = lot_info_short_instance.to_dict()
# create an instance of LotInfoShort from a dict
lot_info_short_form_dict = lot_info_short.from_dict(lot_info_short_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


