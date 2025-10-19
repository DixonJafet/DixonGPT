# Use a lightweight base image with Python
FROM python:3.11-slim

# Install system dependencies for llama-cpp-python
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libssl-dev \
    libffi-dev \
    git \
    python3-dev \
    awscli \
    && rm -rf /var/lib/apt/lists/*



# Set working directory in the container
WORKDIR /app

# Install Python dependencies, including a server and llama-cpp-python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt



# Copy the Python API code into the container
COPY api.py .
# Copy the rest of the application
COPY entrypoint.sh .

# Make entrypoint script executable
RUN sed -i 's/\r$//' entrypoint.sh && \
    chmod +x entrypoint.sh


# Create models directory
RUN mkdir -p /models

# Set environment variables
ENV S3_BUCKET_NAME=my-llama-models-bucket-jafetdixon
ENV S3_MODEL_KEY=Llama-3.2-3B-Instruct-Q4_K_S.gguf
ENV MODEL_PATH=/models/Llama-3.2-3B-Instruct-Q4_K_S.gguf

# Expose the port for the API
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["/bin/bash","./entrypoint.sh"]

# Set a command to run when the container starts
CMD ["python", "api.py"]