# Fort AI Demo

Demo de videollamada estilo Google Meet con avatar animado de Ricardo Fort.
Voz clonada, lip-sync en tiempo real, respuestas en personaje.

> **Disclaimer**: Recreación con IA — no es la persona real. Solo para entretenimiento.

---

## Stack

| Componente | Tecnología |
|---|---|
| Orquestador | LiveKit Agents v1.5 (Python) |
| STT | Deepgram nova-2, español |
| LLM | Groq llama-3.3-70b-versatile |
| TTS | ElevenLabs (voz clonada) |
| Avatar lip-sync | Simli (livekit-plugins-simli) |
| Frontend | Next.js 14 + @livekit/components-react |

---

## Requisitos previos

- Python 3.10+
- Node.js 18+
- Cuentas y API keys de: LiveKit, Deepgram, Groq, ElevenLabs, Simli

---

## Configuración

### 1. Clonar / entrar al proyecto

```bash
cd fort-ai-demo
```

### 2. Completar el .env del agente

```bash
cp .env.example agent/.env
```

Editá `agent/.env` y completá todas las claves:

```
LIVEKIT_URL=wss://tu-proyecto.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
DEEPGRAM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=xxxxxxxxxxxxxxxxxxxxxx   # ID de la voz clonada de Fort
SIMLI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SIMLI_FACE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # faceId del avatar de Fort en Simli
```

### 3. Completar el .env del frontend

```bash
cp .env.example frontend/.env.local
```

Editá `frontend/.env.local` — solo necesitás estas 3 claves (las mismas que en el agente):

```
LIVEKIT_URL=wss://tu-proyecto.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Instalación

```bash
make install
```

Esto instala las dependencias de Python y Node en un solo comando.

Alternativamente, por separado:

```bash
# Python
cd agent && pip install -r requirements.txt

# Node
cd frontend && npm install
```

---

## Correr el proyecto

Abrí **dos terminales separadas** desde la raíz del proyecto:

**Terminal 1 — Agente:**
```bash
make agent
# o: cd agent && python agent.py dev
```

**Terminal 2 — Frontend:**
```bash
make frontend
# o: cd frontend && npm run dev
```

Luego abrí [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Flujo de la demo

1. Página de inicio → clic en **"Unirse a la llamada"**
2. El frontend obtiene un token LiveKit de `/api/token`
3. Te conectás al room `fort-demo`
4. El agente detecta tu voz (silero VAD) → transcribe con Deepgram → genera respuesta con Groq → sintetiza con ElevenLabs → Simli anima el avatar con lip-sync
5. Ves el video del avatar centrado y tu propia cámara en miniatura abajo a la derecha
6. Clic en 📵 para colgar y volver a la pantalla de inicio

---

## Notas de versiones

- `livekit-agents~=1.5` — usa el patrón `AgentServer` + `AgentSession` (API v1.x)
- **NO** uses `VoicePipelineAgent` — es la API v0.x, deprecada
- Groq se integra via `openai.LLM.with_groq()` (no existe plugin `livekit-plugins-groq` separado estable)
- El turn detector semántico (`livekit-plugins-turn-detector`) está deprecado desde v1.5; la demo usa solo silero VAD

---

## Estructura del proyecto

```
fort-ai-demo/
├── agent/
│   ├── agent.py          # Agente LiveKit: VAD → STT → LLM → TTS → Simli
│   ├── requirements.txt
│   └── .env              # Tus claves (no commitear)
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Landing con botón "Unirse"
│   │   ├── call/page.tsx # Sala estilo Google Meet
│   │   └── api/token/    # Genera tokens LiveKit
│   └── components/
│       ├── MeetRoom.tsx  # Wrapper LiveKitRoom
│       ├── AvatarTile.tsx # Video del avatar
│       ├── SelfView.tsx  # Cámara propia
│       └── ControlBar.tsx # Botones mic/cam/colgar
├── .env.example
├── Makefile
└── README.md
```
