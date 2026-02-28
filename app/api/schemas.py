from pydantic import BaseModel
from typing import List

class ReviewResponse(BaseModel):
    summary: str
    issues: List[str]
    suggestions: List[str]
    risk: str
    risk_reason: str