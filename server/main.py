from fastapi import FastAPI
import uvicorn

from app.api.routers.image import router as image_router
from app.api.routers.message import router as message_router

app = FastAPI()

app.include_router(image_router)
app.include_router(message_router)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=9000)