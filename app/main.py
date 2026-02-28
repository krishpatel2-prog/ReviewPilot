from fastapi import FastAPI #This is what creates your entire web application.
from app.api.github_routes import router as github_router

app = FastAPI(title="ReviewPilot")

app.include_router(github_router)

@app.get("/")
def root():
    return {"status":"ReviewPilot API running"}