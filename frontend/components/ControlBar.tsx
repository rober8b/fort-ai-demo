"use client";

import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { useRouter } from "next/navigation";

export default function ControlBar() {
  const router = useRouter();
  const room = useRoomContext();
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled } =
    useLocalParticipant();

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  const hangUp = async () => {
    await room.disconnect();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center gap-4 py-4 bg-[#202124]">
      {/* Micrófono */}
      <button
        onClick={toggleMic}
        title={isMicrophoneEnabled ? "Silenciar" : "Activar micrófono"}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
          isMicrophoneEnabled
            ? "bg-[#3c4043] hover:bg-[#5f6368] text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {isMicrophoneEnabled ? "🎤" : "🔇"}
      </button>

      {/* Cámara */}
      <button
        onClick={toggleCamera}
        title={isCameraEnabled ? "Apagar cámara" : "Activar cámara"}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
          isCameraEnabled
            ? "bg-[#3c4043] hover:bg-[#5f6368] text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {isCameraEnabled ? "📷" : "📷"}
      </button>

      {/* Colgar */}
      <button
        onClick={hangUp}
        title="Colgar"
        className="w-14 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xl transition-colors px-4"
      >
        📵
      </button>
    </div>
  );
}
