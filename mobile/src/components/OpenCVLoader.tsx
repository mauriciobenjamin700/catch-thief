import React, { useState } from "react";
import { View, Text } from "react-native";
import OpenCVWebView from "./OpenCVWebView"; // Certifique-se de que o OpenCVWebView está no mesmo diretório

export default function OpenCVLoader({ onReady }: { onReady: () => void }) {
  const [opencvLoaded, setOpenCVLoaded] = useState(false);

  const handleOpenCVLoad = () => {
    console.log("OpenCV.js carregado com sucesso!");
    setOpenCVLoaded(true);
    onReady(); // Notifica o componente pai que o OpenCV está pronto
  };

  return (
    <View style={{ flex: 1 }}>
      {!opencvLoaded ? (
        <OpenCVWebView onLoad={handleOpenCVLoad} />
      ) : (
        <Text>OpenCV.js está pronto para uso!</Text>
      )}
    </View>
  );
}