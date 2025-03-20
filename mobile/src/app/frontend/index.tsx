import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import OpenCVWebView from "../../components/OpenCVWebView"; // Certifique-se de ajustar o caminho conforme necessário

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false); // Evita capturas repetidas
  const [opencvLoaded, setOpenCVLoaded] = useState(false); // Gerencia o carregamento do OpenCV.js
  const cameraRef = useRef<CameraView>(null);
  const SERVER_URL = "ws://192.168.1.22:9000/images/ws"; // URL do WebSocket

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(SERVER_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleOpenCVLoad = () => {
    console.log("OpenCV.js carregado com sucesso!");
    setOpenCVLoaded(true);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleMonitoring = () => {
    setIsMonitoring((prev) => !prev);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isDetecting) {
      setIsDetecting(true); // Evita capturas repetidas
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      if (photo) {
        setPhotoUri(photo.uri);
        if (photo.base64) {
          const byteArray = base64ToByteArray(photo.base64);
          await sendPhotoToServer(byteArray);
        } else {
          console.error("Photo base64 data is undefined");
        }
      }
      setTimeout(() => {
        setIsDetecting(false);
      }, 5000); // Delay de 2 segundos
    }
  };

  const base64ToByteArray = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const sendPhotoToServer = async (byteArray: Uint8Array) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(byteArray);
      } catch (error) {
        console.error("Erro ao enviar foto:", error);
      }
    } else {
      console.error("WebSocket is not open");
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
      }, 2000); // Captura quadros a cada 1 segundo
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
  text: { fontSize: 18, color: "white" },
  preview: { width: 100, height: 100, alignSelf: "center", marginTop: 10 },
});