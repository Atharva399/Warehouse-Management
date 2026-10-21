from functools import wraps
from secrets import token_urlsafe

from flask import Flask, jsonify, request, g
from flask_cors import CORS

import mock_data

app = Flask(__name__)
CORS(app)

USERS = {
    "admin": {"password": "123456", "name": "Admin User", "role": "Administrator"},
    "clerk": {"password": "123456", "name": "Clerk User", "role": "Warehouse Clerk"},
}

# Demo-only in-memory tokens. For production, use a persistent session store
# or a properly configured identity provider/JWT implementation.
ACTIVE_TOKENS = {}


def require_auth(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        scheme, _, token = auth_header.partition(" ")
        if scheme.lower() != "bearer" or not token or token not in ACTIVE_TOKENS:
            return jsonify({"success": False, "message": "Authentication required."}), 401
        g.current_user = ACTIVE_TOKENS[token]
        return view(*args, **kwargs)
    return wrapped


@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/api/login", methods=["POST"])
def login():
    # silent=True handles missing, malformed, or non-JSON bodies without a 415.
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    password = data.get("password")
    account = USERS.get(username)
    if account and account["password"] == password:
        token = token_urlsafe(32)
        ACTIVE_TOKENS[token] = {
            "name": account["name"],
            "role": account["role"],
            "username": username,
        }
        return jsonify({
            "success": True,
            "token": token,
            "user": {"name": account["name"], "role": account["role"]},
        })
    return jsonify({"success": False, "message": "Invalid username or password."}), 401


@app.route("/api/products")
@require_auth
def get_products():
    return jsonify(mock_data.products)


@app.route("/api/suppliers")
@require_auth
def get_suppliers():
    return jsonify(mock_data.suppliers)


@app.route("/api/customers")
@require_auth
def get_customers():
    return jsonify(mock_data.customers)


@app.route("/api/purchase-orders")
@require_auth
def get_purchase_orders():
    return jsonify(mock_data.purchase_orders)


@app.route("/api/sales-orders")
@require_auth
def get_sales_orders():
    return jsonify(mock_data.sales_orders)


@app.route("/api/stock-movements")
@require_auth
def get_stock_movements():
    return jsonify(mock_data.stock_movements)


@app.route("/api/warehouses")
@require_auth
def get_warehouses():
    return jsonify(mock_data.warehouses)


@app.route("/api/employees")
@require_auth
def get_employees():
    return jsonify(mock_data.employees)


@app.route("/api/dashboard-summary")
@require_auth
def get_dashboard_summary():
    return jsonify({
        "totalProducts": len(mock_data.products),
        "totalStock": sum(p["stock"] for p in mock_data.products),
        "lowStockItems": len([p for p in mock_data.products if p["status"] == "Low Stock"]),
        "pendingOrders": len([o for o in mock_data.sales_orders + mock_data.purchase_orders if o["status"] in ("Pending", "Processing")]),
        "totalSuppliers": len(mock_data.suppliers),
        "totalCustomers": len(mock_data.customers),
    })


@app.errorhandler(404)
def not_found(_error):
    if request.path.startswith("/api/"):
        return jsonify({"success": False, "message": "Resource not found."}), 404
    return jsonify({"success": False, "message": "Not found."}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False, port=5000)
