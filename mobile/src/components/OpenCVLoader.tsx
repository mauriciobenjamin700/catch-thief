import React, { useState } from "react";
import { View, Text } from "react-native";
import OpenCVWebView from "./OpenCVWebView"; 
export default function OpenCVLoader({ onReady }: { onReady: () => void }) {
  const [opencvLoaded, setOpenCVLoaded] = useState(false);

  const handleOpenCVLoad = () => {
    console.log("OpenCV.js carregado com sucesso!");
    setOpenCVLoaded(true);
    onReady();
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