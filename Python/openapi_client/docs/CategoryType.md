# CategoryType


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** |  | 
**items** | [**List[CategoryItem]**](CategoryItem.md) |  | 

## Example

```python
from openapi_client.models.category_type import CategoryType

# TODO update the JSON string below
json = "{}"
# create an instance of CategoryType from a JSON string
category_type_instance = CategoryType.from_json(json)
# print the JSON string representation of the object
print CategoryType.to_json()

# convert the object into a dict
category_type_dict = category_type_instance.to_dict()
# create an instance of CategoryType from a dict
category_type_form_dict = category_type.from_dict(category_type_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


