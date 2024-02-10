# PurchaseInfo


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**price** | **float** |  | [optional] 
**quantity** | **int** |  | 
**var_date** | **str** |  | 

## Example

```python
from openapi_client.models.purchase_info import PurchaseInfo

# TODO update the JSON string below
json = "{}"
# create an instance of PurchaseInfo from a JSON string
purchase_info_instance = PurchaseInfo.from_json(json)
# print the JSON string representation of the object
print PurchaseInfo.to_json()

# convert the object into a dict
purchase_info_dict = purchase_info_instance.to_dict()
# create an instance of PurchaseInfo from a dict
purchase_info_form_dict = purchase_info.from_dict(purchase_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


