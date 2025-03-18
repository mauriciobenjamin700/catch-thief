from fastapi import UploadFile
from os import makedirs
from os.path import (
    abspath,
    exists
)
from shutil import copyfileobj

from app.core.ids import id_generator
from app.core.settings import settings


class ImageServices:
    
    @staticmethod
    async def save_image(image: UploadFile) -> str:
        """
        Save an image to the upload directory
        
        - Args:
            - image: UploadFile: The image to save
        - Returns:
            - str: Returns the path to the saved image
        """
        makedirs(abspath(settings.IMAGE_UPLOAD_DIR), exist_ok=True)
        image_path = f"{settings.IMAGE_UPLOAD_DIR}/{id_generator()}.jpg"
        
        with open(abspath(image_path), "wb") as buffer:
            
            copyfileobj(image.file, buffer)
            
        return image_path
    
    @staticmethod
    async def get_image(image_path: str) -> str:
        """
        Get an image from the upload directory
        
        - Args:
            - image_path: str: The path to the image
        - Returns:
            - bytes: Returns the image as bytes
        """
        true_path = abspath(image_path)
        
        if not exists(true_path):
            raise FileNotFoundError(f"File not found: {true_path}")
        
        return true_path