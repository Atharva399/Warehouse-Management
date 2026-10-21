pipeline {
    agent any
    options { timestamps(); disableConcurrentBuilds() }
    environment {
        DOCKERHUB_USER = 'atharvapangare'
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/warehouse-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/warehouse-backend"
        K8S_NAMESPACE = 'default'
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Backend tests') {
            steps {
                sh '''python3 -m venv .venv-ci
. .venv-ci/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python backend/test_api.py'''
            }
        }
        stage('Frontend build') {
            steps {
                // Use a pinned Node.js container so the Jenkins host does not need Node/npm installed.
                sh '''docker run --rm \
  -v "$WORKSPACE/frontend:/app" \
  -w /app \
  node:22-alpine sh -lc 'node --version && npm --version && npm ci && npm run build' '''
            }
        }
        stage('Build Docker images') {
            steps {
                sh '''docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest .
docker build -f Dockerfile.backend -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest .'''
            }
        }
        stage('Push Docker images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_TOKEN')]) {
                    sh '''echo "$DH_TOKEN" | docker login -u "$DH_USER" --password-stdin
docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
docker push ${FRONTEND_IMAGE}:latest
docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
docker push ${BACKEND_IMAGE}:latest
docker logout'''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh '''kubectl apply -f k8s/
kubectl set image deployment/wms-frontend frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} -n ${K8S_NAMESPACE}
kubectl set image deployment/wms-backend backend=${BACKEND_IMAGE}:${BUILD_NUMBER} -n ${K8S_NAMESPACE}
kubectl rollout status deployment/wms-frontend -n ${K8S_NAMESPACE} --timeout=180s
kubectl rollout status deployment/wms-backend -n ${K8S_NAMESPACE} --timeout=180s
kubectl get pods,services -n ${K8S_NAMESPACE}'''
            }
        }
    }
    post {
        always { sh 'docker image prune -f || true' }
        success { echo 'CI/CD completed: tests passed, images pushed, Kubernetes rollout successful.' }
        failure { echo 'Pipeline failed. Open the failed stage console output to diagnose.' }
    }
}
