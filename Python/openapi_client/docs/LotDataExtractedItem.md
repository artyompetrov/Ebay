# LotDataExtractedItem


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**value** | **str** |  | 
**extractor_info** | [**List[ExtractorInfo]**](ExtractorInfo.md) |  | 

## Example

```python
from openapi_client.models.lot_data_extracted_item import LotDataExtractedItem

# TODO update the JSON string below
json = "{}"
# create an instance of LotDataExtractedItem from a JSON string
lot_data_extracted_item_instance = LotDataExtractedItem.from_json(json)
# print the JSON string representation of the object
print LotDataExtractedItem.to_json()

# convert the object into a dict
lot_data_extracted_item_dict = lot_data_extracted_item_instance.to_dict()
# create an instance of LotDataExtractedItem from a dict
lot_data_extracted_item_form_dict = lot_data_extracted_item.from_dict(lot_data_extracted_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


