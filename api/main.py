# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from .model import recommend

app = FastAPI()

class RecommendationRequest(BaseModel):
    movie_title: str

class RecommendationResponse(BaseModel):
    movie_title: str
    recommendations: List[str]

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    recommendations = recommend(request.movie_title)
    if not recommendations:
        raise HTTPException(status_code=404, detail="Movie not found in the database.")
    return {
        "movie_title": request.movie_title,
        "recommendations": recommendations
    }
