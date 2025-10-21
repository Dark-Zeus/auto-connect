#!/bin/bash
source ./.env
# This script resets the Kubernetes deployments for the application.
set -e
echo "Resetting Kubernetes deployments..."
kubectl delete -f manifests/backend-service.yaml || true
kubectl delete -f manifests/frontend-service.yaml || true
kubectl delete -f manifests/backend-deployment.yaml || true
kubectl delete -f manifests/frontend-deployment.yaml || true
kubectl delete -f manifests/namespace.yaml || true

kubectl delete namespace $K8S_NAMESPACE || true
echo "Reset completed."