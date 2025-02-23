import frappe

@frappe.whitelist(allow_guest=True)
def auth():
    return "Chrome extension auth page"