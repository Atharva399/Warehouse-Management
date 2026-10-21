# StockFlow WMS - Warehouse Management System

A basic Warehouse Management System built as a college Software Engineering project.

**Login credentials:**
- Admin (full access): `admin` / `123456`
- Warehouse Clerk (view/add stock only — Dashboard, Products, Inventory, Stock Movement): `clerk` / `123456`

## Project Structure

```
warehouse/
├── frontend/        # React + Vite dashboard (all pages and UI)
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── components/   # Sidebar, Header, Modal, StatusBadge, StatCard
│       ├── data/         # Mock data used by the frontend
│       └── pages/        # One file per module (Products, Inventory, Orders, ...)
├── backend/         # Simple Flask API (login + mock data endpoints)
│   ├── server.py
│   └── mock_data.py
├── requirements.txt # Python dependencies for the backend
└── README.md
```

## How to Run

The frontend works on its own (mock data is built in). The backend is optional
and only needed to demo the API part of the project.

### Frontend (required)

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:5173).

### Backend (optional)

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python backend/server.py
```

API available at http://localhost:5000/api (e.g. `/api/products`, `/api/login`).


## CI/CD deployment

This repository includes a Jenkins pipeline, Dockerfiles, and Kubernetes manifests for the CI/CD assignment. See [`CI-CD-SETUP.md`](CI-CD-SETUP.md) for setup instructions. Configure the Jenkins credential ID `dockerhub-creds` with your Docker Hub username and an access token; never store the token in this repository.
