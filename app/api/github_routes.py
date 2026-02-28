from fastapi import APIRouter
from pydantic import BaseModel#Pydantic is a validation library. When you inherit from BaseModel it automatically validates incoming data for you. Wrong type? Missing field? It rejects it before your code even runs.
from app.github.pr_service import PullRequestService
from app.services.review_service import ReviewService
from app.api.schemas import ReviewResponse

router = APIRouter()

#The Pydantic Model
class PullRequest(BaseModel):
#This defines what the request body must look like. When someone calls your endpoint they must send:
    repo: str
    pr_number: int

@router.post("/github/pr")
def get_pr_data(data: PullRequest):#data here is all the input fields by the user
    service = PullRequestService()
    return service.get_pr_data(data.repo, data.pr_number)

@router.post("/review", response_model=ReviewResponse)
def review_pr(data: PullRequest):
    service = ReviewService()
    result = service.review_pr(data.repo, data.pr_number)
    return result

