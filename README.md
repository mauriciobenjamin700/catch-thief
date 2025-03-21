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

## Estrutura do Projeto

A estrutura do código do projeto "Catch Thief" está organizada em dois diretórios principais: `server` e `mobile`. Aqui está uma visão geral da estrutura do código e dos principais módulos:

```bash
.gitignore
docker-compose.yaml
README.md
mobile/
    .gitignore
    app.json
    package.json
    README.md
    tsconfig.json
    src/
        app/
            _layout.tsx
            index.tsx
        assets/
            fonts/
            images/
server/
    .gitignore
    .python-version
    Dockerfile
    main.py
    pyproject.toml
    README.md
    requirements.txt
    test.py
    uv.lock
    .vscode/
        settings.json
    app/
        api/
            __init__.py
            html/
                pages.py
            middlewares/
                __init__.py
            routers/
                __init__.py
                image.py
                message.py
        core/
            __init__.py
            ids.py
            settings.py
        data/
            ...
        images/
            ...
        manager/
            __init__.py
            app.py
            scripts.py
        schemas/
            __init__.py
        services/
            __init__.py
            images.py
        utils/
            alert.py
```

### Principais Módulos

- server
  - main.py: Ponto de entrada do servidor FastAPI. Configura e inicia o servidor.
  - app/api/routers/image.py: Define as rotas relacionadas ao envio e recebimento de imagens via WebSocket e HTTP.
  - app/api/routers/message.py: Define as rotas relacionadas ao envio e recebimento de mensagens via WebSocket.
  - app/api/html/pages.py: Contém o conteúdo HTML para as páginas WebSocket.
  - app/core/settings.py: Configurações da aplicação, como diretórios de upload de imagens.
  - app/core/ids.py: Geração de IDs únicos para imagens.
  - app/services/images.py: Serviços para salvar e recuperar imagens.
  - app/utils/alert.py: Função para tocar um som de notificação.
  - app/manager/scripts.py: Script para enviar imagens via WebSocket.
  - Dockerfile: Arquivo de configuração do Docker para construir a imagem do servidor.
  - requirements.txt: Lista de dependências Python necessárias para o servidor.

- mobile

  - app.json: Configurações do aplicativo Expo.
  - package.json: Lista de dependências e scripts do Node.js.
  - tsconfig.json: Configurações do TypeScript.
  - src/app/_layout.tsx: Layout principal do aplicativo.
  - src/app/index.tsx: Ponto de entrada do aplicativo.

## Resumo

O projeto "Catch Thief" é dividido em duas partes principais: o servidor Python, que lida com a comunicação e armazenamento de imagens, e o aplicativo mobile, que é desenvolvido usando Expo e React Native. O servidor utiliza FastAPI para definir rotas e WebSockets para comunicação em tempo real. O aplicativo mobile é configurado para usar Expo e inclui dependências para navegação, ícones e manipulação de câmera.

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
