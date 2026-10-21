"""API test script for StockFlow WMS (Software Engineering project).

Runs the Flask app in-process with Flask's test client, so you do NOT need to
start the server separately. It calls every endpoint and checks the response
status code, content type and data shape.

Run it from the project root with:
    python backend/test_api.py
"""

import sys
from pathlib import Path

# Make `import server` / `import mock_data` work no matter where you run this from.
sys.path.insert(0, str(Path(__file__).resolve().parent))

from server import app, USERS  # noqa: E402

client = app.test_client()

# ---------------------------------------------------------------------------
# Tiny test harness (keeps output readable for the project report / viva)
# ---------------------------------------------------------------------------
results = []


def check(name, condition, detail=""):
    """Record one test result. status is PASS/FAIL."""
    status = "PASS" if condition else "FAIL"
    results.append((status, name, detail))
    print(f"[{status}] {name}" + (f"  ->  {detail}" if detail and not condition else ""))


def get_json(path):
    resp = client.get(path)
    return resp, resp.get_json()


# ---------------------------------------------------------------------------
# 1. Authentication
# ---------------------------------------------------------------------------
def test_login():
    # Valid admin credentials
    resp = client.post("/api/login", json={"username": "admin", "password": "123456"})
    body = resp.get_json()
    check("Login with valid admin credentials returns 200", resp.status_code == 200,
          f"got {resp.status_code}")
    check("Valid login sets success=True", body.get("success") is True)
    check("Valid login returns role Administrator",
          body.get("user", {}).get("role") == "Administrator")

    # Valid clerk credentials
    resp = client.post("/api/login", json={"username": "clerk", "password": "123456"})
    check("Login with valid clerk credentials returns 200", resp.status_code == 200,
          f"got {resp.status_code}")

    # Wrong password -> 401
    resp = client.post("/api/login", json={"username": "admin", "password": "wrong"})
    check("Login with wrong password returns 401", resp.status_code == 401,
          f"got {resp.status_code}")

    # Unknown user -> 401
    resp = client.post("/api/login", json={"username": "ghost", "password": "123456"})
    check("Login with unknown user returns 401", resp.status_code == 401,
          f"got {resp.status_code}")

    # Empty JSON body (no username) -> 401, not a crash
    resp = client.post("/api/login", json={})
    check("Login with empty JSON body returns 401", resp.status_code == 401,
          f"got {resp.status_code}")


# ---------------------------------------------------------------------------
# 2. Read (GET) endpoints the frontend pages depend on
# ---------------------------------------------------------------------------
LIST_ENDPOINTS = [
    ("/api/products", "PRD-1001"),
    ("/api/suppliers", "SUP-201"),
    ("/api/customers", "CUS-301"),
    ("/api/purchase-orders", "PO-2026-043"),
    ("/api/sales-orders", "SO-2026-116"),
    ("/api/stock-movements", "MOV-9001"),
    ("/api/warehouses", "WH-01"),
    ("/api/employees", "EMP-001"),
]


def test_list_endpoints():
    for path, sample_id in LIST_ENDPOINTS:
        resp, data = get_json(path)
        check(f"GET {path} returns 200", resp.status_code == 200, f"got {resp.status_code}")
        check(f"GET {path} returns a non-empty list",
              isinstance(data, list) and len(data) > 0,
              f"got {type(data).__name__}")
        if isinstance(data, list) and data:
            ids = [row.get("id") for row in data]
            check(f"GET {path} contains id {sample_id}", sample_id in ids,
                  f"ids={ids}")
            check(f"GET {path} rows are JSON objects",
                  all(isinstance(row, dict) for row in data))


# ---------------------------------------------------------------------------
# 3. Dashboard summary - verify the computed numbers match the mock data
# ---------------------------------------------------------------------------
def test_dashboard_summary():
    resp, data = get_json("/api/dashboard-summary")
    check("GET /api/dashboard-summary returns 200", resp.status_code == 200,
          f"got {resp.status_code}")
    for key in ("totalProducts", "totalStock", "lowStockItems",
                "pendingOrders", "totalSuppliers", "totalCustomers"):
        check(f"dashboard summary has key '{key}'", key in data, f"keys={list(data)}")

    # Cross-check against the raw lists (independent of the summary code path)
    import mock_data
    check("totalProducts matches product count",
          data["totalProducts"] == len(mock_data.products),
          f"{data['totalProducts']} != {len(mock_data.products)}")
    check("totalStock matches sum of product stock",
          data["totalStock"] == sum(p["stock"] for p in mock_data.products),
          f"{data['totalStock']} != {sum(p['stock'] for p in mock_data.products)}")
    check("lowStockItems matches count of 'Low Stock' products",
          data["lowStockItems"] == len([p for p in mock_data.products if p["status"] == "Low Stock"]),
          f"{data['lowStockItems']}")
    check("totalSuppliers matches supplier count",
          data["totalSuppliers"] == len(mock_data.suppliers))
    check("totalCustomers matches customer count",
          data["totalCustomers"] == len(mock_data.customers))
    check("pendingOrders counts Pending+Processing sales/purchase orders",
          data["pendingOrders"] == len([o for o in mock_data.sales_orders + mock_data.purchase_orders
                                        if o["status"] in ("Pending", "Processing")]))


# ---------------------------------------------------------------------------
# 4. Data integrity checks (same id appears only once, no missing ids)
# ---------------------------------------------------------------------------
def test_data_integrity():
    import mock_data
    for name in ("products", "suppliers", "customers", "purchase_orders",
                 "sales_orders", "stock_movements", "warehouses", "employees"):
        rows = getattr(mock_data, name)
        ids = [row["id"] for row in rows]
        check(f"{name}: every record has an id", all(ids))
        check(f"{name}: no duplicate ids", len(ids) == len(set(ids)))


# ---------------------------------------------------------------------------
# 5. Unknown route returns 404 (not a 500 crash)
# ---------------------------------------------------------------------------
def test_unknown_route():
    resp = client.get("/api/does-not-exist")
    check("Unknown /api route returns 404", resp.status_code == 404,
          f"got {resp.status_code}")


# ---------------------------------------------------------------------------
# 6. KNOWN GAPS - these checks describe behaviour the API SHOULD have but
#    currently does NOT, so they FAIL until the backend is fixed. See the
#    "how to fix" notes next to each one.
# ---------------------------------------------------------------------------
KNOWN_GAPS = {
    "GAP 1: data endpoints require authentication",
    "GAP 2: login handles a missing JSON body",
    "GAP 3: unknown resource returns a JSON 404",
}


def test_known_gaps():
    # GAP 1 - Every data endpoint is open to anyone; there is no token or
    # session check, so unauthenticated callers can read all data.
    # FIX: add an auth check (e.g. a decorator that requires a token) and
    #      return 401 when it is missing.
    resp = client.get("/api/products")
    check("GAP 1: data endpoints require authentication",
          resp.status_code == 401,
          f"got {resp.status_code} - data is readable without logging in")

    # GAP 2 - A request with no JSON body/content-type is rejected by Flask
    # with 415 before the handler's `or {}` fallback runs, instead of a
    # clean 401 "invalid credentials".
    # FIX: use request.get_json(silent=True) so a bad body returns 401.
    resp = client.post("/api/login")
    check("GAP 2: login handles a missing JSON body",
          resp.status_code == 401,
          f"got {resp.status_code} - should be a clean 401, not a 415")

    # GAP 3 - Requesting a resource that does not exist returns Flask's
    # default HTML 404 page, which a JSON client cannot parse.
    # FIX: add an error handler that returns JSON for 404 (and other errors).
    resp = client.get("/api/products/PRD-9999")
    check("GAP 3: unknown resource returns a JSON 404",
          resp.status_code == 404 and resp.is_json,
          f"got {resp.status_code}, json_body={resp.is_json} - HTML, not JSON")


def main():
    print("=" * 60)
    print("StockFlow WMS - API test suite")
    print("=" * 60)
    print(f"Users configured: {', '.join(USERS)}\n")

    test_login()
    test_list_endpoints()
    test_dashboard_summary()
    test_data_integrity()
    test_unknown_route()
    test_known_gaps()

    passed = sum(1 for s, _, _ in results if s == "PASS")
    failed = sum(1 for s, _, _ in results if s == "FAIL")
    total = len(results)

    print("\n" + "=" * 60)
    print(f"RESULT: {passed}/{total} passed, {failed} failed")
    print("=" * 60)

    if failed:
        gaps = [name for name in KNOWN_GAPS
                if any(s == "FAIL" and n == name for s, n, _ in results)]
        real_failures = [f for f in failures() if f[0] not in KNOWN_GAPS]

        if gaps:
            print("\nKnown gaps (expected to fail until the backend is fixed):")
            for status, name, detail in results:
                if status == "FAIL" and name in KNOWN_GAPS:
                    print(f"  - {name} ({detail})")

        if real_failures:
            print("\nUnexpected failures:")
            for status, name, detail in real_failures:
                print(f"  - {name} ({detail})")

    # Exit code 1 on failure so this works in CI / a shell script.
    sys.exit(1 if failed else 0)


def failures():
    return [(name, detail) for status, name, detail in results if status == "FAIL"]


if __name__ == "__main__":
    main()
