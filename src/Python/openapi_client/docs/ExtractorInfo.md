# ExtractorInfo


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**extracted_from** | **str** |  | 
**extractor** | **str** |  | 
**match** | **str** |  | 

## Example

```python
from openapi_client.models.extractor_info import ExtractorInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ExtractorInfo from a JSON string
extractor_info_instance = ExtractorInfo.from_json(json)
# print the JSON string representation of the object
print ExtractorInfo.to_json()

# convert the object into a dict
extractor_info_dict = extractor_info_instance.to_dict()
# create an instance of ExtractorInfo from a dict
extractor_info_form_dict = extractor_info.from_dict(extractor_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


