from fastapi import (
    APIRouter,
    UploadFile,
    WebSocket,
    WebSocketDisconnect
)
from fastapi.responses import FileResponse, JSONResponse
from threading import Thread
from time import sleep


from app.services.images import ImageServices
from app.utils.alert import play_notification_sound


router = APIRouter(prefix="/images", tags=["Images"])

activate_alert = True
alert_thread = None

def alert_loop():
    while activate_alert:
        play_notification_sound("app/data/bell.mp3")
        sleep(1)  #

@router.put("/toggle-sound")
async def toggle_sound():
    global activate_alert, alert_thread
    activate_alert = not activate_alert
    if activate_alert and (alert_thread is None or not alert_thread.is_alive()):
        alert_thread = Thread(target=alert_loop)
        alert_thread.start()
    return {
        "detail": "Alert Activated" if activate_alert else "Alert Not Activated",
        "activated": activate_alert
    }

@router.put("/deactivate-sound")
async def toggle_sound():
    global activate_alert, alert_thread
    activate_alert = False
    if activate_alert and (alert_thread is None or not alert_thread.is_alive()):
        alert_thread = Thread(target=alert_loop)
        alert_thread.start()
    return {
        "detail": "Alert Activated" if activate_alert else "Alert Not Activated",
        "activated": activate_alert
    }



@router.post("")
async def send_image(image: UploadFile):
    image_path = await ImageServices.save_image(image)
    global activate_alert, alert_thread
    activate_alert = True
    if activate_alert and (alert_thread is None or not alert_thread.is_alive()):
        alert_thread = Thread(target=alert_loop)
        alert_thread.start()
    return JSONResponse(
        content={"image_path": image_path},
        status_code=201
    )
    
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            
            image_path = await ImageServices.save_image(data)
            
            print(f"Image saved: {image_path}")
            
            global activate_alert, alert_thread
            activate_alert = True
            if activate_alert and (alert_thread is None or not alert_thread.is_alive()):
                alert_thread = Thread(target=alert_loop)
                alert_thread.start()
            
            await websocket.send_json({"image_path": image_path})
    except WebSocketDisconnect as e:
        print(f"WebSocket disconnected: {e.code}, {e.reason}")
        
    except Exception as e:
        print(f"Server Error: {e}")


@router.get("")
async def get_image(image_path: str) -> FileResponse:
    image = await ImageServices.get_image(image_path)
    return FileResponse(image, media_type="image/jpeg")