from flask import Flask, request, jsonify
import os
from datetime import datetime
from playsound import playsound
import threading

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
ALARM_FILE = "alarm.mp3"
alarm_active = False

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def play_alarm():
    global alarm_active
    while alarm_active:
        playsound(ALARM_FILE)

@app.route("/upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    filename = datetime.now().strftime("%Y%m%d_%H%M%S.jpg")
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return jsonify({"message": "File uploaded successfully", "filename": filename}), 200

@app.route("/alarm", methods=["POST"])
def trigger_alarm():
    global alarm_active
    if not alarm_active:
        alarm_active = True
        threading.Thread(target=play_alarm).start()
    return jsonify({"message": "Alarm triggered"}), 200

@app.route("/stop-alarm", methods=["POST"])
def stop_alarm():
    global alarm_active
    alarm_active = False
    return jsonify({"message": "Alarm stopped"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
