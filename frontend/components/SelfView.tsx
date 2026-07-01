"use client";

import { useLocalParticipant, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function SelfView() {
  const { localParticipant, isCameraEnabled } = useLocalParticipant();

  return (
    <div className="absolute bottom-4 right-4 w-36 aspect-video bg-[#3c4043] rounded-xl overflow-hidden border border-[#5f6368] shadow-lg flex items-center justify-center">
      {isCameraEnabled && localParticipant ? (
        <VideoTrack
          trackRef={{
            participant: localParticipant,
            source: Track.Source.Camera,
          }}
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-[#9aa0a6]">
          <span className="text-2xl">👤</span>
          <span className="text-xs">Vos</span>
        </div>
      )}

      {/* Etiqueta */}
      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
        Vos
      </div>
    </div>
  );
}
