from flask import Flask, jsonify, request
from flask_cors import CORS

import mock_data

app = Flask(__name__)
CORS(app)

USERS = {
    "admin": {"password": "123456", "name": "Admin User", "role": "Administrator"},
    "clerk": {"password": "123456", "name": "Clerk User", "role": "Warehouse Clerk"},
}


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    account = USERS.get(data.get("username"))
    if account and account["password"] == data.get("password"):
        return jsonify({"success": True, "user": {"name": account["name"], "role": account["role"]}})
    return jsonify({"success": False, "message": "Invalid username or password."}), 401


@app.route("/api/products")
def get_products():
    return jsonify(mock_data.products)


@app.route("/api/suppliers")
def get_suppliers():
    return jsonify(mock_data.suppliers)


@app.route("/api/customers")
def get_customers():
    return jsonify(mock_data.customers)


@app.route("/api/purchase-orders")
def get_purchase_orders():
    return jsonify(mock_data.purchase_orders)


@app.route("/api/sales-orders")
def get_sales_orders():
    return jsonify(mock_data.sales_orders)


@app.route("/api/stock-movements")
def get_stock_movements():
    return jsonify(mock_data.stock_movements)


@app.route("/api/warehouses")
def get_warehouses():
    return jsonify(mock_data.warehouses)


@app.route("/api/employees")
def get_employees():
    return jsonify(mock_data.employees)


@app.route("/api/dashboard-summary")
def get_dashboard_summary():
    return jsonify({
        "totalProducts": len(mock_data.products),
        "totalStock": sum(p["stock"] for p in mock_data.products),
        "lowStockItems": len([p for p in mock_data.products if p["status"] == "Low Stock"]),
        "pendingOrders": len([o for o in mock_data.sales_orders + mock_data.purchase_orders if o["status"] in ("Pending", "Processing")]),
        "totalSuppliers": len(mock_data.suppliers),
        "totalCustomers": len(mock_data.customers),
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
