from fastapi import FastAPI

app = FastAPI(title="ReviewPilot")

@app.get("/")
def root():
    return {"status":"ReviewPilot API running"}