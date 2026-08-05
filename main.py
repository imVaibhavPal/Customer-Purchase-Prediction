from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Customer Purchase Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic Model for Input Validation
class PredictionInput(BaseModel):
    Age: int = Field(ge=18, le=120)
    AnnualIncome: float = Field(ge=0)
    NumberOfPurchases: int = Field(ge=0)
    TimeSpentOnWebsite: float = Field(ge=0)
    CustomerTenureYears: float = Field(ge=0)
    LastPurchaseDaysAgo: int = Field(ge=0)
    Gender: str
    ProductCategory: str
    PreferredDevice: str
    Region: str
    ReferralSource: str
    CustomerSegment: str
    LoyaltyProgram: int = Field(ge=0, le=1)
    DiscountsAvailed: int = Field(ge=0)
    SessionCount: int = Field(ge=1)
    CustomerSatisfaction: int = Field(ge=1, le=5)

# Load the model globally
MODEL_PATH = 'model.pkl'
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
else:
    model = None
    print("Warning: model.pkl not found. Please train the model first.")

@app.get("/")
def read_root():
    return {"status": "running"}

@app.post("/predict")
def predict(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Ensure model.pkl exists in the directory.")
    
    # Convert Pydantic object to dictionary, then to pandas DataFrame
    # Using model_dump() for Pydantic v2 support
    input_dict = data.model_dump() if hasattr(data, 'model_dump') else data.dict()
    input_df = pd.DataFrame([input_dict])
    
    # Get prediction and probabilities
    pred = model.predict(input_df)[0]
    prob = model.predict_proba(input_df)[0]
    
    prediction_class = int(pred)
    probability = float(max(prob))
    confidence = f"{probability * 100:.2f}%"
    
    return {
        "Prediction": prediction_class,
        "Probability": probability,
        "Confidence": confidence
    }

if __name__ == "__main__":
    import uvicorn
    # Run the API locally
    uvicorn.run(app, host="127.0.0.1", port=8000)
