from fastapi import FastAPI

app = FastAPI(title="SOLARIS API")


@app.get("/")
def home():
    return {"message": "SOLARIS backend is running!"}