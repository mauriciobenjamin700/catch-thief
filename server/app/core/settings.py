from pydantic import Field
from pydantic_settings import (
    BaseSettings, 
    SettingsConfigDict
)



class Settings(BaseSettings):
    """
    Settings for the application
    
    - Attributes:
        - IMAGE_UPLOAD_DIR: str: The directory to save uploaded images
    """
    IMAGE_UPLOAD_DIR: str = Field(default="app/images")
    
    model_config = SettingsConfigDict(case_sensitive=True)
    

settings = Settings()