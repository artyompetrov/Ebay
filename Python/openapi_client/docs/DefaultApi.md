# openapi_client.DefaultApi

All URIs are relative to */api/ebay/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_product**](DefaultApi.md#create_product) | **POST** /products | Create product
[**delete_product**](DefaultApi.md#delete_product) | **DELETE** /products/{id} | Delete product
[**get_all_products**](DefaultApi.md#get_all_products) | **GET** /products | List all products
[**get_categories**](DefaultApi.md#get_categories) | **GET** /categories/ | 
[**get_currencies**](DefaultApi.md#get_currencies) | **GET** /currencies/ | 
[**get_lot_info**](DefaultApi.md#get_lot_info) | **GET** /lots/{lotId}/ | Получить информацию о лоте
[**get_lot_states**](DefaultApi.md#get_lot_states) | **POST** /lot_state_requests/ | Получает информацию о учтенных лотах
[**get_lots**](DefaultApi.md#get_lots) | **GET** /products/{productId}/lots/ | 
[**get_product**](DefaultApi.md#get_product) | **GET** /products/{id} | 
[**get_shipping_rates**](DefaultApi.md#get_shipping_rates) | **GET** /shipping_rates/ | 
[**mark_product_as_checked**](DefaultApi.md#mark_product_as_checked) | **POST** /products/{id}/mark_as_checked/ | MarkProductAsChecked
[**save_error**](DefaultApi.md#save_error) | **POST** /error/ | Save Error
[**update_product**](DefaultApi.md#update_product) | **PUT** /products/{id} | Update product
[**upsert_lot_info**](DefaultApi.md#upsert_lot_info) | **POST** /products/{productId}/lots/ | Обновляет информацию о лоте


# **create_product**
> str create_product(product)

Create product

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.product_without_id import ProductWithoutId
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    product = openapi_client.ProductWithoutId() # ProductWithoutId | 

    try:
        # Create product
        api_response = api_instance.create_product(product)
        print("The response of DefaultApi->create_product:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->create_product: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **product** | [**ProductWithoutId**](ProductWithoutId.md)|  | 

### Return type

**str**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Updated |  -  |
**400** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_product**
> delete_product(id)

Delete product

### Example

```python
import time
import os
import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Delete product
        api_instance.delete_product(id)
    except Exception as e:
        print("Exception when calling DefaultApi->delete_product: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_all_products**
> List[ProductWithId] get_all_products()

List all products

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.product_with_id import ProductWithId
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        # List all products
        api_response = api_instance.get_all_products()
        print("The response of DefaultApi->get_all_products:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_all_products: %s\n" % e)
```



### Parameters
This endpoint does not need any parameter.

### Return type

[**List[ProductWithId]**](ProductWithId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_categories**
> List[CategoryType] get_categories()



### Example

```python
import time
import os
import openapi_client
from openapi_client.models.category_type import CategoryType
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        api_response = api_instance.get_categories()
        print("The response of DefaultApi->get_categories:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_categories: %s\n" % e)
```



### Parameters
This endpoint does not need any parameter.

### Return type

[**List[CategoryType]**](CategoryType.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_currencies**
> List[Currency] get_currencies()



### Example

```python
import time
import os
import openapi_client
from openapi_client.models.currency import Currency
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        api_response = api_instance.get_currencies()
        print("The response of DefaultApi->get_currencies:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_currencies: %s\n" % e)
```



### Parameters
This endpoint does not need any parameter.

### Return type

[**List[Currency]**](Currency.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_lot_info**
> LotInfoWithProductId get_lot_info(lot_id)

Получить информацию о лоте

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.lot_info_with_product_id import LotInfoWithProductId
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    lot_id = 56 # int | 

    try:
        # Получить информацию о лоте
        api_response = api_instance.get_lot_info(lot_id)
        print("The response of DefaultApi->get_lot_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_lot_info: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lot_id** | **int**|  | 

### Return type

[**LotInfoWithProductId**](LotInfoWithProductId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |
**400** | NotFound |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_lot_states**
> List[LotState] get_lot_states(lot_ids)

Получает информацию о учтенных лотах

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.lot_state import LotState
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    lot_ids = [56] # List[int] | 

    try:
        # Получает информацию о учтенных лотах
        api_response = api_instance.get_lot_states(lot_ids)
        print("The response of DefaultApi->get_lot_states:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_lot_states: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lot_ids** | [**List[int]**](int.md)|  | 

### Return type

[**List[LotState]**](LotState.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_lots**
> List[LotInfoShort] get_lots(product_id)



### Example

```python
import time
import os
import openapi_client
from openapi_client.models.lot_info_short import LotInfoShort
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    product_id = 'product_id_example' # str | 

    try:
        api_response = api_instance.get_lots(product_id)
        print("The response of DefaultApi->get_lots:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_lots: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **product_id** | **str**|  | 

### Return type

[**List[LotInfoShort]**](LotInfoShort.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |
**400** | NotFound |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_product**
> ProductWithId get_product(id)



### Example

```python
import time
import os
import openapi_client
from openapi_client.models.product_with_id import ProductWithId
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        api_response = api_instance.get_product(id)
        print("The response of DefaultApi->get_product:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_product: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

[**ProductWithId**](ProductWithId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |
**400** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_shipping_rates**
> List[ShippingType] get_shipping_rates()



### Example

```python
import time
import os
import openapi_client
from openapi_client.models.shipping_type import ShippingType
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        api_response = api_instance.get_shipping_rates()
        print("The response of DefaultApi->get_shipping_rates:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_shipping_rates: %s\n" % e)
```



### Parameters
This endpoint does not need any parameter.

### Return type

[**List[ShippingType]**](ShippingType.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mark_product_as_checked**
> mark_product_as_checked(id)

MarkProductAsChecked

### Example

```python
import time
import os
import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # MarkProductAsChecked
        api_instance.mark_product_as_checked(id)
    except Exception as e:
        print("Exception when calling DefaultApi->mark_product_as_checked: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Updated |  -  |
**400** | NotFound |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **save_error**
> save_error(error)

Save Error

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.client_error_info import ClientErrorInfo
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    error = openapi_client.ClientErrorInfo() # ClientErrorInfo | 

    try:
        # Save Error
        api_instance.save_error(error)
    except Exception as e:
        print("Exception when calling DefaultApi->save_error: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **error** | [**ClientErrorInfo**](ClientErrorInfo.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_product**
> update_product(id, product)

Update product

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.product_without_id import ProductWithoutId
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    product = openapi_client.ProductWithoutId() # ProductWithoutId | 

    try:
        # Update product
        api_instance.update_product(id, product)
    except Exception as e:
        print("Exception when calling DefaultApi->update_product: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **product** | [**ProductWithoutId**](ProductWithoutId.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Updated |  -  |
**400** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **upsert_lot_info**
> upsert_lot_info(product_id, lot_info)

Обновляет информацию о лоте

### Example

```python
import time
import os
import openapi_client
from openapi_client.models.lot_info import LotInfo
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /api/ebay/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "/api/ebay/v1"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    product_id = 'product_id_example' # str | 
    lot_info = openapi_client.LotInfo() # LotInfo | 

    try:
        # Обновляет информацию о лоте
        api_instance.upsert_lot_info(product_id, lot_info)
    except Exception as e:
        print("Exception when calling DefaultApi->upsert_lot_info: %s\n" % e)
```



### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **product_id** | **str**|  | 
 **lot_info** | [**LotInfo**](LotInfo.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Ok |  -  |
**400** | NotFound |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

