import React, { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";

const OpenCVWebView = ({ onLoad }: { onLoad: () => void }) => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    // Verifica se o OpenCV.js foi carregado
    const interval = setInterval(() => {
      webViewRef.current?.injectJavaScript(`
        if (typeof cv !== 'undefined') {
          window.ReactNativeWebView.postMessage('opencv-loaded');
        }
      `);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={["*"]}
      source={{
        html: `
          <html>
            <head>
              <script src="https://docs.opencv.org/4.x/opencv.js"></script>
            </head>
            <body>
              <h1>Carregando OpenCV.js...</h1>
            </body>
          </html>
        `,
      }}
      onMessage={(event) => {
        if (event.nativeEvent.data === "opencv-loaded") {
          console.log("OpenCV.js carregado com sucesso!");
          onLoad(); // Notifica o componente pai que o OpenCV foi carregado
        }
      }}
    />
  );
};

export default OpenCVWebView;