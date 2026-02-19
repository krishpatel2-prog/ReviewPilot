from fastapi import APIRouter
from pydantic import BaseModel
from app.github.pr_service import PullRequestService

router = APIRouter()

class PullRequest(BaseModel):
    repo: str
    pr_number: int

@router.post("/github/pr")
def get_pr_data(data: PullRequest):
    service = PullRequestService()
    return service.get_pr_data(data.repo, data.pr_number)

