# ExtractedFields


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field_name** | **str** |  | 
**extracted_data** | [**List[LotDataExtractedItem]**](LotDataExtractedItem.md) |  | 

## Example

```python
from openapi_client.models.extracted_fields import ExtractedFields

# TODO update the JSON string below
json = "{}"
# create an instance of ExtractedFields from a JSON string
extracted_fields_instance = ExtractedFields.from_json(json)
# print the JSON string representation of the object
print ExtractedFields.to_json()

# convert the object into a dict
extracted_fields_dict = extracted_fields_instance.to_dict()
# create an instance of ExtractedFields from a dict
extracted_fields_form_dict = extracted_fields.from_dict(extracted_fields_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


