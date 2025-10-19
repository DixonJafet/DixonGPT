import os
import uvicorn
import boto3
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama

# Configure S3 and model parameters
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
S3_MODEL_KEY = os.environ.get("S3_MODEL_KEY")
MODEL_PATH = "/models/Llama-3.2-3B-Instruct-Q4_K_S.gguf"

# Check if model exists locally, otherwise download from S3
if not os.path.exists(MODEL_PATH):
    print("Downloading model from S3...")
    s3_client = boto3.client('s3')
    try:
        s3_client.download_file(S3_BUCKET_NAME, S3_MODEL_KEY, MODEL_PATH)
        print("Model downloaded successfully!")
    except Exception as e:
        print(f"Error downloading model: {e}")
        exit(1)

# Load the Llama model
try:
    llm = Llama(model_path=MODEL_PATH, n_gpu_layers=0)
    # n_gpu_layers=0 means CPU inference. Change to a positive number for GPU acceleration if available.
except Exception as e:
    print(f"Error loading LLM: {e}")
    exit(1)

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "https://dixon-gpt.vercel.app",
    "https://dixon-gpt-dixonjafets-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)
# --- End CORS Configuration ---

class PromptRequest(BaseModel):
    prompt: str
    max_tokens: int = 512
    temperature: float = 0.7

@app.post("/generate")
async def generate_text(request: PromptRequest):
    try:
        output = llm(
            request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        # Extract the generated text from the model's output
        generated_text = output["choices"][0]["text"].strip()
        return {"response": generated_text}
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)