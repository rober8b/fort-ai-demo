"use client";

import { useEffect, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar";

interface AvatarTileProps {
  onAvatarReady?: (avatar: StreamingAvatar) => void;
}

export default function AvatarTile({ onAvatarReady }: AvatarTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let destroyed = false;

    async function init() {
      setStatus("loading");
      try {
        // Obtener token de HeyGen desde el servidor
        const res = await fetch("/api/heygen-token");
        const data = await res.json();
        if (!res.ok || !data.token) throw new Error(data.error ?? "No token");

        const avatar = new StreamingAvatar({ token: data.token });
        avatarRef.current = avatar;

        // Conectar el stream al elemento de video
        avatar.on(StreamingEvents.STREAM_READY, (evt: any) => {
          if (videoRef.current && evt.detail) {
            videoRef.current.srcObject = evt.detail;
            videoRef.current.play().catch(() => {});
          }
          setStatus("ready");
          onAvatarReady?.(avatar);
        });

        avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          if (!destroyed) setStatus("idle");
        });

        const avatarId = process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID ?? "";

        await avatar.createStartAvatar({
          quality: AvatarQuality.High,
          avatarName: avatarId,
          voice: { rate: 1.0 },
          language: "es",
        });
      } catch (e: any) {
        if (!destroyed) {
          setErrorMsg(e?.message ?? String(e));
          setStatus("error");
        }
      }
    }

    init();

    return () => {
      destroyed = true;
      avatarRef.current?.stopAvatar().catch(() => {});
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl aspect-video bg-[#3c4043] rounded-2xl overflow-hidden flex items-center justify-center">
      {/* Video del avatar HeyGen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${status === "ready" ? "block" : "hidden"}`}
      />

      {/* Estado de carga */}
      {status !== "ready" && (
        <div className="flex flex-col items-center gap-3 text-[#9aa0a6]">
          <div className="w-20 h-20 rounded-full bg-[#5f6368] flex items-center justify-center text-4xl">
            🎭
          </div>
          <span className="text-sm">
            {status === "loading" && "Iniciando avatar…"}
            {status === "idle" && "Esperando…"}
            {status === "error" && `Error: ${errorMsg}`}
          </span>
        </div>
      )}

      <div className="absolute bottom-3 left-4 bg-black/60 text-white text-sm font-medium px-2 py-1 rounded">
        Ricardo Fort — IA
      </div>
    </div>
  );
}
