from fastapi import (
    APIRouter,
    UploadFile
)
from fastapi.responses import FileResponse, JSONResponse

from app.services.images import ImageServices


router = APIRouter(prefix="/images", tags=["images"])


@router.post("")
async def send_image(image: UploadFile):
    image_path = await ImageServices.save_image(image)
    return JSONResponse(
        content={"image_path": image_path},
        status_code=201
    )


@router.get("")
async def get_image(image_path: str) -> FileResponse:
    image = await ImageServices.get_image(image_path)
    return FileResponse(image, media_type="image/jpeg")