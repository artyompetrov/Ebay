# ClientErrorInfo


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **str** |  | 
**error** | **str** |  | 

## Example

```python
from openapi_client.models.client_error_info import ClientErrorInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ClientErrorInfo from a JSON string
client_error_info_instance = ClientErrorInfo.from_json(json)
# print the JSON string representation of the object
print ClientErrorInfo.to_json()

# convert the object into a dict
client_error_info_dict = client_error_info_instance.to_dict()
# create an instance of ClientErrorInfo from a dict
client_error_info_form_dict = client_error_info.from_dict(client_error_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


