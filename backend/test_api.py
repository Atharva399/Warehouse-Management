"""API tests for StockFlow WMS. Run from the project root: python backend/test_api.py."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from server import app, USERS  # noqa: E402
import mock_data  # noqa: E402

client = app.test_client()
results = []


def check(name, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    results.append((status, name, detail))
    print(f"[{status}] {name}" + (f" -> {detail}" if detail and not condition else ""))


def check_json_response(resp, name):
    check(name, resp.is_json, f"content type={resp.content_type}")


def login_as(username="admin", password="123456"):
    resp = client.post("/api/login", json={"username": username, "password": password})
    if resp.status_code == 200 and resp.is_json:
        return resp.get_json().get("token")
    return None


def test_login():
    resp = client.post("/api/login", json={"username": "admin", "password": "123456"})
    body = resp.get_json() or {}
    check("Valid admin login returns 200", resp.status_code == 200, f"got {resp.status_code}")
    check("Valid login sets success=True", body.get("success") is True)
    check("Valid login returns Administrator role", body.get("user", {}).get("role") == "Administrator")
    check("Valid login returns an access token", isinstance(body.get("token"), str) and len(body["token"]) > 10)
    resp = client.post("/api/login", json={"username": "clerk", "password": "123456"})
    check("Valid clerk login returns 200", resp.status_code == 200, f"got {resp.status_code}")
    resp = client.post("/api/login", json={"username": "admin", "password": "wrong"})
    check("Wrong password returns 401", resp.status_code == 401, f"got {resp.status_code}")
    resp = client.post("/api/login", json={"username": "ghost", "password": "123456"})
    check("Unknown user returns 401", resp.status_code == 401, f"got {resp.status_code}")
    resp = client.post("/api/login", json={})
    check("Empty JSON body returns 401", resp.status_code == 401, f"got {resp.status_code}")
    resp = client.post("/api/login")
    check("Missing JSON body returns 401", resp.status_code == 401, f"got {resp.status_code}")


def test_authentication():
    resp = client.get("/api/products")
    check("Data endpoints reject unauthenticated requests", resp.status_code == 401, f"got {resp.status_code}")
    token = login_as()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    resp = client.get("/api/products", headers=headers)
    check("Data endpoints accept a valid bearer token", resp.status_code == 200, f"got {resp.status_code}")
    resp = client.get("/api/products", headers={"Authorization": "Bearer invalid-token"})
    check("Data endpoints reject an invalid bearer token", resp.status_code == 401, f"got {resp.status_code}")


def test_list_endpoints():
    token = login_as()
    headers = {"Authorization": f"Bearer {token}"}
    endpoints = [
        ("/api/products", mock_data.products, "PRD-1001"),
        ("/api/suppliers", mock_data.suppliers, "SUP-201"),
        ("/api/customers", mock_data.customers, "CUS-301"),
        ("/api/purchase-orders", mock_data.purchase_orders, "PO-2026-043"),
        ("/api/sales-orders", mock_data.sales_orders, "SO-2026-116"),
        ("/api/stock-movements", mock_data.stock_movements, "MOV-9001"),
        ("/api/warehouses", mock_data.warehouses, "WH-01"),
        ("/api/employees", mock_data.employees, "EMP-001"),
    ]
    for path, expected_data, sample_id in endpoints:
        resp = client.get(path, headers=headers)
        data = resp.get_json()
        check(f"GET {path} returns 200", resp.status_code == 200, f"got {resp.status_code}")
        check(f"GET {path} returns a non-empty list", isinstance(data, list) and len(data) > 0)
        if isinstance(data, list):
            check(f"GET {path} contains id {sample_id}", sample_id in [row.get("id") for row in data])
            check(f"GET {path} rows are JSON objects", all(isinstance(row, dict) for row in data))


def test_dashboard_summary():
    token = login_as()
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/api/dashboard-summary", headers=headers)
    data = resp.get_json() or {}
    check("GET /api/dashboard-summary returns 200", resp.status_code == 200, f"got {resp.status_code}")
    for key in ("totalProducts", "totalStock", "lowStockItems", "pendingOrders", "totalSuppliers", "totalCustomers"):
        check(f"Dashboard summary contains {key}", key in data)
    check("totalProducts matches product count", data.get("totalProducts") == len(mock_data.products))
    check("totalStock matches sum of product stock", data.get("totalStock") == sum(p["stock"] for p in mock_data.products))
    check("lowStockItems matches low-stock count", data.get("lowStockItems") == len([p for p in mock_data.products if p["status"] == "Low Stock"]))
    check("totalSuppliers matches supplier count", data.get("totalSuppliers") == len(mock_data.suppliers))
    check("totalCustomers matches customer count", data.get("totalCustomers") == len(mock_data.customers))
    check("pendingOrders matches pending/processing orders", data.get("pendingOrders") == len([o for o in mock_data.sales_orders + mock_data.purchase_orders if o["status"] in ("Pending", "Processing")]))


def test_data_integrity():
    for name in ("products", "suppliers", "customers", "purchase_orders", "sales_orders", "stock_movements", "warehouses", "employees"):
        rows = getattr(mock_data, name)
        ids = [row.get("id") for row in rows]
        check(f"{name}: every record has an id", all(ids))
        check(f"{name}: no duplicate ids", len(ids) == len(set(ids)))


def test_not_found():
    resp = client.get("/api/products/PRD-9999")
    check("Unknown API resource returns 404", resp.status_code == 404, f"got {resp.status_code}")
    check("Unknown API resource returns JSON", resp.is_json, f"content type={resp.content_type}")


def main():
    print("=" * 60)
    print("StockFlow WMS - API test suite")
    print("=" * 60)
    print(f"Users configured: {', '.join(USERS)}\n")
    test_login()
    test_authentication()
    test_list_endpoints()
    test_dashboard_summary()
    test_data_integrity()
    test_not_found()
    passed = sum(status == "PASS" for status, _, _ in results)
    failed = sum(status == "FAIL" for status, _, _ in results)
    print("\n" + "=" * 60)
    print(f"RESULT: {passed}/{len(results)} passed, {failed} failed")
    print("=" * 60)
    if failed:
        for status, name, detail in results:
            if status == "FAIL":
                print(f"FAILED: {name} {detail}")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
