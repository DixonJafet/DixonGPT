#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Model variables
MODEL_FILE="Llama-3.2-3B-Instruct-Q4_K_S.gguf"
S3_BUCKET_NAME="my-llama-models-bucket-jafetdixon"
MODEL_DIR="/models"

# Check if the model file is already downloaded
if [ ! -f "${MODEL_DIR}/${MODEL_FILE}" ]; then
    echo "Model not found. Downloading from S3..."
    mkdir -p "${MODEL_DIR}"
    # Use 'aws s3 cp' to download the model
    aws s3 cp s3://${S3_BUCKET_NAME}/${MODEL_FILE} "${MODEL_DIR}/${MODEL_FILE}"
    echo "Download complete."
else
    echo "Model already exists. Skipping download."
fi

# Run the main application
exec "$@"