from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.github_routes import router as github_router

app = FastAPI(title="ReviewPilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github_router)

@app.get("/")
def root():
    return {"status": "ReviewPilot API running"}