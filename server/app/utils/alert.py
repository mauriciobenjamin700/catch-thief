from pygame import mixer
from pygame import time


def play_notification_sound(sound_file: str = "/app/data/bell.mp3"):
    mixer.init()
    mixer.music.load(sound_file)
    mixer.music.play()
    while mixer.music.get_busy():
        time.Clock().tick(10)