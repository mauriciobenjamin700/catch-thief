# Projeto Catch Thief

📌 Atividade 2 – Sensor de Proximidade para Monitoramento Remoto

## 🎯 Objetivo

Desenvolver um aplicativo Android que utilize o sensor de proximidade para ativar um modo de segurança. Quando o sensor detectar movimento, um sinal de alerta será enviado a um servidor Python rodando em um notebook, acionando um alarme sonoro ininterrupto. Além disso, o aplicativo capturará uma foto do intruso e enviará ao servidor, que armazenará a imagem para consulta posterior.

## 📋 Requisitos Funcionais

✔ O aplicativo deve permitir ativar e desativar o modo de segurança.
✔ Ao detectar movimento no sensor de proximidade, o aplicativo deve:
    - Enviar um sinal de alerta ao servidor.
    - Capturar uma foto do intruso e transmiti-la ao servidor.
    - Acionar um alarme sonoro ininterrupto ao receber o alerta.
    - Armazenar a imagem capturada em uma pasta local.
    - Disponibilizar um botão para desativar o alarme.

## ⚙ Requisitos Técnicos

✔ Protocolo de Comunicação: Sockets TCP/IP.
✔ Linguagem de Programação: Python.
✔ Plataforma do Aplicativo: Android.
✔ Servidor: Aplicação Python rodando em um notebook.
✔ Bibliotecas sugeridas:
    - Android: Kivy (Python) ou Kotlin/Java (nativo).
    - Captura de Imagem: CameraX API ou OpenCV.
    - Servidor: socket, tkinter (interface gráfica), PIL (manipulação de imagens).

## 📌 Demonstração

✔ Ativar o modo de segurança no aplicativo.
✔ Acionar o sensor de proximidade para simular uma tentativa de acesso.
✔ O servidor recebe o alerta, ativa o alarme e armazena a imagem do intruso.
✔ O alarme será desativado manualmente pelo botão no servidor.

## 📌 Entrega

✔ Repositório GitHub: Postar apenas o link do projeto no SIGAA.
✔ No GitHub, incluir:
    - Descrição detalhada do trabalho
    - Instruções de instalação e execução
    - Explicação do funcionamento
    - Capturas de tela do aplicativo, do servidor e das imagens capturadas
    - Estrutura do código e principais módulos

## 🚀 Como Executar o App

Para executar o projeto, siga os passos abaixo:

### 1. Clone o Repositório

```bash
git clone https://github.com/mauriciobenjamin700/catch-thief.git
cd catch-thief
```

### 2. Configurar e Executar o Servidor

Crie e ative um ambiente virtual Python:

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # No Windows use: .venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r [requirements.txt](./server/requirements.txt)
```

### 3. Configurar e Executar o Frontend

Instale as dependências do Node.js:

```bash
cd ../mobile
npm install
```

Execute o projeto usando Expo:

```bash
npx expo start -c
```
