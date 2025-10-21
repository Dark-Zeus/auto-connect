#!/bin/bash
source ./.env

# This script builds a Docker image and pushes it to a given Docker registry.
set -e

echo "Logging in to Docker registry: $DOCKER_REGISTRY"
echo "Please enter your Docker registry credentials:"

docker login $DOCKER_REGISTRY

# Build the Docker image
docker build -t $DOCKER_REGISTRY/$BASE_IMAGE_NAME-frontend:$IMAGE_TAG ../auto-connect-frontend
docker build -t $DOCKER_REGISTRY/$BASE_IMAGE_NAME-backend:$IMAGE_TAG ../auto-connect-backend

# Push the Docker image to the registry
docker push $DOCKER_REGISTRY/$BASE_IMAGE_NAME-frontend:$IMAGE_TAG
docker push $DOCKER_REGISTRY/$BASE_IMAGE_NAME-backend:$IMAGE_TAG
