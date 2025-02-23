import frappe
from frappe import _
import json

@frappe.whitelist(allow_guest=True)
def generate():
    doctype = "Item"
    """Generate Swagger documentation for the given Doctype."""
    
    # Получаем метаданные Doctype
    meta = frappe.get_meta(doctype)

    if not meta:
        return {"error": _("Doctype not found")}

    # Создаём структуру OpenAPI 3.0
    swagger_doc = {
        "openapi": "3.0.0",
        "info": {
            "title": f"{doctype} API",
            "description": f"Auto-generated Swagger for {doctype}",
            "version": "1.0.0"
        },
        "paths": {
            f"/api/resource/{doctype}": {  # Исправлено на динамическое использование lower()
                "get": {
                    "summary": f"Get {doctype} list",
                    "description": f"Retrieve a list of {doctype} records",
                    "parameters": [
                        {"name": "fields", "in": "query", "schema": {"type": "string"}},
                        {"name": "filters", "in": "query", "schema": {"type": "string"}},
                        {"name": "order_by", "in": "query", "schema": {"type": "string"}},
                        {"name": "limit_start", "in": "query", "schema": {"type": "integer"}},
                        {"name": "limit_page_length", "in": "query", "schema": {"type": "integer"}}
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "data": {
                                                "type": "array",
                                                "items": {"$ref": f"#/components/schemas/{doctype}"}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "components": {
            "schemas": {
                doctype: {
                    "type": "object",
                    "properties": {},
                    "required": []  # Добавил список required
                }
            }
        }
    }

    # Заполняем модель полями Doctype
    for field in meta.fields:
        field_schema = {
            "type": map_frappe_type_to_openapi(field.fieldtype),
            "description": field.label or field.fieldname
        }

        # Добавляем `format` для даты и чисел
        if field.fieldtype in ["Date", "Datetime"]:
            field_schema["format"] = "date-time"
        elif field.fieldtype == "Currency" or field.fieldtype == "Float":
            field_schema["format"] = "float"

        # Добавляем поле в модель
        swagger_doc["components"]["schemas"][doctype]["properties"][field.fieldname] = field_schema
        
        # Если поле `required`, добавляем его в список `required`
        if field.reqd:
            swagger_doc["components"]["schemas"][doctype]["required"].append(field.fieldname)

    return swagger_doc


def map_frappe_type_to_openapi(frappe_type):
    """Map Frappe field types to OpenAPI types."""
    mapping = {
        "Data": "string",
        "Text": "string",
        "Small Text": "string",
        "Long Text": "string",
        "Date": "string",
        "Datetime": "string",
        "Int": "integer",
        "Float": "number",  # Учитывая "float"
        "Currency": "number",  # Учитывая формат
        "Check": "boolean",
        "Select": "string",
        "Link": "string"
    }
    return mapping.get(frappe_type, "string")
