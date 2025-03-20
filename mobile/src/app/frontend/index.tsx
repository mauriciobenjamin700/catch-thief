import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import OpenCVWebView from "../../components/OpenCVWebView"; // Certifique-se de ajustar o caminho conforme necessário

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [alarmSound, setAlarmSound] = useState<Audio.Sound | null>(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false); // Evita capturas repetidas
  const [opencvLoaded, setOpenCVLoaded] = useState(false); // Gerencia o carregamento do OpenCV.js
  const cameraRef = useRef<CameraView>(null);
  const SERVER_URL = "http://192.168.1.3:5000";

  const handleOpenCVLoad = () => {
    console.log("OpenCV.js carregado com sucesso!");
    setOpenCVLoaded(true);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleMonitoring = async () => {
    if (isMonitoring) {
      await stopAlarm(); // Para o alarme ao desativar o monitoramento
    }
    setIsMonitoring((prev) => !prev);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isDetecting) {
      setIsDetecting(true); // Evita capturas repetidas
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhotoUri(photo.uri);
        await sendPhotoToServer(photo.uri);
      }
      setIsDetecting(false);
    }
  };

  const sendPhotoToServer = async (photoUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: photoUri,
      name: "intruder.jpg",
      type: "image/jpg",
    } as any);

    try {
      await fetch(`${SERVER_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!isAlarmPlaying) {
        playAlarm(); // Ativa o alarme na primeira captura
      }
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
    }
  };

  const playAlarm = async () => {
    if (!isAlarmPlaying) {
      const { sound } = await Audio.Sound.createAsync(require("../assets/alarm.mp3"));
      setAlarmSound(sound);
      setIsAlarmPlaying(true);
      await sound.playAsync();
    }
  };

  const stopAlarm = async () => {
    if (alarmSound) {
      await alarmSound.stopAsync(); // Para o som imediatamente
      await alarmSound.unloadAsync(); // Libera o recurso do som
      setAlarmSound(null);
      setIsAlarmPlaying(false); // Atualiza o estado para remover o botão
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isMonitoring) {
      interval = setInterval(async () => {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({ base64: true });
          const hasMotion = photo && detectMotion(photo.base64 ?? ""); // Função fictícia para detectar movimento
          if (hasMotion) {
            takePicture();
          }
        }
      }, 1000); // Captura quadros a cada 1 segundo
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const detectMotion = (currentFrame: string): boolean => {
    // Aqui você pode implementar uma lógica para comparar o quadro atual com o anterior
    // e detectar mudanças significativas. Por simplicidade, retornamos true.
    return true;
  };

  return (
    <View style={styles.container}>
      {!opencvLoaded ? (
        <>
          <Text style={styles.message}>Carregando OpenCV.js...</Text>
          <OpenCVWebView onLoad={handleOpenCVLoad} />
        </>
      ) : !permission?.granted ? (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      ) : (
        <>
          {!isMonitoring ? (
            <TouchableOpacity style={styles.monitorButton} onPress={toggleMonitoring}>
              <Text style={styles.text}>Ativar Monitoramento</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>Trocar Câmera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.monitorButton} onPress={toggleMonitoring}>
                    <Text style={styles.text}>Desativar Monitoramento</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          )}

          {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

          {isAlarmPlaying && (
            <TouchableOpacity style={styles.alarmButton} onPress={stopAlarm}>
              <Text style={styles.text}>⏹ Parar Alarme</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  cameraContainer: { flex: 1, width: "100%" },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: { backgroundColor: "gray", padding: 10, borderRadius: 5 },
  monitorButton: { backgroundColor: "green", padding: 15, borderRadius: 5, margin: 10 },
  alarmButton: { backgroundColor: "blue", padding: 15, borderRadius: 5, margin: 20, alignItems: "center" },
  text: { fontSize: 18, color: "white" },
  preview: { width: 100, height: 100, alignSelf: "center", marginTop: 10 },
});