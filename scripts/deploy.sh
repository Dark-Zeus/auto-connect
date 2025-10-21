#!/bin/bash

source ./.env
# This script deploys the Docker images to a Kubernetes cluster.
set -e
echo "Deploying to Kubernetes cluster..."
kubectl apply -f manifests/namespace.yaml
kubectl apply -f manifests/frontend-deployment.yaml
kubectl apply -f manifests/backend-deployment.yaml
kubectl apply -f manifests/frontend-service.yaml
kubectl apply -f manifests/backend-service.yaml

echo "Deployment completed."