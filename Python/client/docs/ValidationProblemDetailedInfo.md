# ValidationProblemDetailedInfo


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
from openapi_client.models.validation_problem_detailed_info import ValidationProblemDetailedInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ValidationProblemDetailedInfo from a JSON string
validation_problem_detailed_info_instance = ValidationProblemDetailedInfo.from_json(json)
# print the JSON string representation of the object
print ValidationProblemDetailedInfo.to_json()

# convert the object into a dict
validation_problem_detailed_info_dict = validation_problem_detailed_info_instance.to_dict()
# create an instance of ValidationProblemDetailedInfo from a dict
validation_problem_detailed_info_form_dict = validation_problem_detailed_info.from_dict(validation_problem_detailed_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


