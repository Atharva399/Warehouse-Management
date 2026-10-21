# Warehouse Management System — CI/CD Setup

This adds Jenkins, Docker Hub and Kubernetes deployment files to the existing StockFlow WMS. It does not replace the application.

## Files added
- `Jenkinsfile`: checkout, Flask API tests, Vite build, Docker image build/push, Kubernetes rollout.
- `Dockerfile.frontend`: builds the React/Vite UI and serves it with Nginx.
- `Dockerfile.backend`: packages the Flask API.
- `nginx.conf`: serves the UI and provides `/api/` proxying to the backend service.
- `k8s/`: Kubernetes deployments and services.

## Important before running
1. Confirm the GitHub default branch and set Jenkins' branch specifier to `*/main` (or your actual branch).
2. Docker Hub username is already set to `atharvapangare` in the `Jenkinsfile` and Kubernetes YAML files. Change it only if your Docker Hub username differs.
4. In Jenkins → Manage Jenkins → Credentials, add a Username with password credential with ID exactly `dockerhub-creds`. Use your Docker Hub username and an access token as the password.
5. Install/configure Docker, `kubectl`, and a Kubernetes cluster on the Jenkins agent. Jenkins must be allowed to run Docker commands, and `kubectl get nodes` must work as the Jenkins build user before running the pipeline.
6. Create a Jenkins Pipeline job → Pipeline script from SCM → Git → repository URL `https://github.com/Atharva399/Warehouse-Management.git` → script path `Jenkinsfile`.
7. Run **Build Now** and inspect **Console Output**.

## Kubernetes access
The frontend service is `NodePort`. For Minikube, run `minikube service wms-frontend --url` on the machine that has Minikube, or use the equivalent NodePort access method for your cluster. Do not open Jenkins port 8080 to the whole internet; restrict it to your IP.

## Verify
```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl rollout status deployment/wms-frontend
kubectl rollout status deployment/wms-backend
```

## Project behavior note
The existing React UI currently uses its own client-side mock data and login. The Flask API has separate mock-data endpoints and is not currently wired into the React UI. This deployment runs both components, but it does not automatically convert the UI to database-backed API data. The demo login is hardcoded in the original frontend; do not use it as real production authentication.


## Backend test fixes

The backend now issues a demo bearer token at login, protects API data routes, returns JSON 404 responses for unknown API paths, and handles missing login JSON cleanly. Kubernetes health probes use `/health`, which does not require a login token. The in-memory token mechanism is intended for this coursework demo, not production authentication.
