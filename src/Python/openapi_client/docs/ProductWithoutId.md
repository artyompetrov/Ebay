# ProductWithoutId


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**search_queries** | [**List[SearchQuery]**](SearchQuery.md) |  | 
**weight** | **int** |  | 

## Example

```python
from openapi_client.models.product_without_id import ProductWithoutId

# TODO update the JSON string below
json = "{}"
# create an instance of ProductWithoutId from a JSON string
product_without_id_instance = ProductWithoutId.from_json(json)
# print the JSON string representation of the object
print ProductWithoutId.to_json()

# convert the object into a dict
product_without_id_dict = product_without_id_instance.to_dict()
# create an instance of ProductWithoutId from a dict
product_without_id_form_dict = product_without_id.from_dict(product_without_id_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


