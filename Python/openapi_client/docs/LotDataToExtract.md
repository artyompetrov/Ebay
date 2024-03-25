# LotDataToExtract


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**condition** | **str** |  | 
**condition_description** | **str** |  | [optional] 
**description** | **str** |  | 
**short_description** | **str** |  | [optional] 
**lot_size** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.lot_data_to_extract import LotDataToExtract

# TODO update the JSON string below
json = "{}"
# create an instance of LotDataToExtract from a JSON string
lot_data_to_extract_instance = LotDataToExtract.from_json(json)
# print the JSON string representation of the object
print LotDataToExtract.to_json()

# convert the object into a dict
lot_data_to_extract_dict = lot_data_to_extract_instance.to_dict()
# create an instance of LotDataToExtract from a dict
lot_data_to_extract_form_dict = lot_data_to_extract.from_dict(lot_data_to_extract_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


