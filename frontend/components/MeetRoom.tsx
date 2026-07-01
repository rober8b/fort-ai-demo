"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import type StreamingAvatar from "@heygen/streaming-avatar";
import { TaskType } from "@heygen/streaming-avatar";
import AvatarTile from "./AvatarTile";
import SelfView from "./SelfView";
import ControlBar from "./ControlBar";

interface MeetRoomProps {
  token: string;
  serverUrl: string;
}

export default function MeetRoom({ token, serverUrl }: MeetRoomProps) {
  const router = useRouter();

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={true}
      className="min-h-screen bg-[#202124] flex flex-col"
      onDisconnected={() => router.push("/")}
    >
      <RoomUI />
    </LiveKitRoom>
  );
}

function RoomUI() {
  const room = useRoomContext();
  const avatarRef = useRef<StreamingAvatar | null>(null);

  const handleAvatarReady = useCallback(
    (avatar: StreamingAvatar) => {
      avatarRef.current = avatar;

      // Escucha mensajes del agente via data channel
      room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(payload));
          if (msg.type === "avatar_speak" && msg.text && avatarRef.current) {
            avatarRef.current
              .speak({ text: msg.text, taskType: TaskType.REPEAT })
              .catch(console.error);
          }
        } catch {}
      });
    },
    [room]
  );

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#202124]">
      {/* Disclaimer */}
      <div className="w-full bg-yellow-400 text-black text-xs font-semibold text-center py-1.5 z-20">
        Recreación con IA — no es la persona real
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-medium">En vivo</span>
        </div>
        <span className="text-[#9aa0a6] text-sm">Fort AI Demo</span>
        <div className="w-20" />
      </header>

      {/* Main video */}
      <div className="relative flex-1 flex items-center justify-center px-4 pb-4">
        <AvatarTile onAvatarReady={handleAvatarReady} />
        <SelfView />
      </div>

      <ControlBar />
    </div>
  );
}
