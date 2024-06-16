# NotFoundProblemDetailedInfo


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**errors** | **object** |  | [optional] 
**type** | **str** |  | [optional] 
**title** | **str** |  | [optional] 
**status** | **int** |  | [optional] 
**detail** | **str** |  | [optional] 
**instance** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.not_found_problem_detailed_info import NotFoundProblemDetailedInfo

# TODO update the JSON string below
json = "{}"
# create an instance of NotFoundProblemDetailedInfo from a JSON string
not_found_problem_detailed_info_instance = NotFoundProblemDetailedInfo.from_json(json)
# print the JSON string representation of the object
print NotFoundProblemDetailedInfo.to_json()

# convert the object into a dict
not_found_problem_detailed_info_dict = not_found_problem_detailed_info_instance.to_dict()
# create an instance of NotFoundProblemDetailedInfo from a dict
not_found_problem_detailed_info_form_dict = not_found_problem_detailed_info.from_dict(not_found_problem_detailed_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


