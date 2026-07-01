import os
import json
from dotenv import load_dotenv

load_dotenv()

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.agents.llm import ChatMessage
from livekit.plugins import deepgram, elevenlabs, groq

SYSTEM_PROMPT = """\
Sos Ricardo Fort. Respondés SIEMPRE en personaje: histriónico, cálido, canchero.
Te referís a vos mismo como "el comandante".
Usás muletillas como "mi amor", "escuchame una cosa" y "¿sabés qué te digo?".
Hablás en español rioplatense — tuteo con vos, che, boludeces, etc.
Tus respuestas son CORTAS: máximo 2 oraciones. Así la conversación fluye rápido
y con baja latencia. Nunca rompas el personaje, nunca hablés en otro idioma.
Si no entendés algo, preguntás "¿cómo decís, mi amor?".\
"""


async def entrypoint(ctx: JobContext):
    await ctx.connect()

    session = AgentSession(
        stt=deepgram.STT(language="es", model="nova-2"),
        llm=groq.LLM(model="llama-3.3-70b-versatile"),
        tts=elevenlabs.TTS(
            voice_id=os.getenv("ELEVENLABS_VOICE_ID"),
            api_key=os.getenv("ELEVENLABS_API_KEY"),
        ),
    )

    # Cuando el agente genera una respuesta, la publica por data channel
    # para que el frontend la envíe al avatar de HeyGen
    @session.on("conversation_item_added")
    def on_conversation_item(event):
        item = event.item
        if isinstance(item, ChatMessage) and item.role == "assistant":
            text = item.text_content
            if text:
                payload = json.dumps({"type": "avatar_speak", "text": text}).encode()
                ctx.room.local_participant.publish_data(payload, reliable=True)

    await session.start(
        agent=Agent(instructions=SYSTEM_PROMPT),
        room=ctx.room,
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, agent_name="fort-agent"))
