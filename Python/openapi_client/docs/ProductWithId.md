# ProductWithId


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**name** | **str** |  | 
**last_check_time** | **str** |  | [optional] 
**search_queries** | [**List[SearchQuery]**](SearchQuery.md) |  | 

## Example

```python
from openapi_client.models.product_with_id import ProductWithId

# TODO update the JSON string below
json = "{}"
# create an instance of ProductWithId from a JSON string
product_with_id_instance = ProductWithId.from_json(json)
# print the JSON string representation of the object
print ProductWithId.to_json()

# convert the object into a dict
product_with_id_dict = product_with_id_instance.to_dict()
# create an instance of ProductWithId from a dict
product_with_id_form_dict = product_with_id.from_dict(product_with_id_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


