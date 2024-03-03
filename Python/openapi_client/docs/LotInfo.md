# LotInfo


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
**description** | **str** |  | 
**condition** | **str** |  | 
**condition_description** | **str** |  | [optional] 
**seller** | **str** |  | 
**located_in** | **str** |  | 
**ignore_that_lot** | **bool** |  | 
**categories** | [**List[CategoryValue]**](CategoryValue.md) |  | 
**title_change_date** | **str** |  | 
**purchase_history** | [**List[PurchaseInfo]**](PurchaseInfo.md) |  | 

## Example

```python
from openapi_client.models.lot_info import LotInfo

# TODO update the JSON string below
json = "{}"
# create an instance of LotInfo from a JSON string
lot_info_instance = LotInfo.from_json(json)
# print the JSON string representation of the object
print LotInfo.to_json()

# convert the object into a dict
lot_info_dict = lot_info_instance.to_dict()
# create an instance of LotInfo from a dict
lot_info_form_dict = lot_info.from_dict(lot_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


