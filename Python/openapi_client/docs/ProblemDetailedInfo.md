# ProblemDetailedInfo


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** |  | [optional] 
**title** | **str** |  | [optional] 
**status** | **int** |  | [optional] 
**detail** | **str** |  | [optional] 
**instance** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.problem_detailed_info import ProblemDetailedInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ProblemDetailedInfo from a JSON string
problem_detailed_info_instance = ProblemDetailedInfo.from_json(json)
# print the JSON string representation of the object
print ProblemDetailedInfo.to_json()

# convert the object into a dict
problem_detailed_info_dict = problem_detailed_info_instance.to_dict()
# create an instance of ProblemDetailedInfo from a dict
problem_detailed_info_form_dict = problem_detailed_info.from_dict(problem_detailed_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


