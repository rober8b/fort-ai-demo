"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const MeetRoom = dynamic(() => import("../../components/MeetRoom"), { ssr: false });

export default function CallPage() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const identity = `user-${Math.random().toString(36).slice(2, 8)}`;
    fetch(`/api/token?room=fort-demo&identity=${identity}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setToken(data.token);
          setUrl(data.url);
        }
      })
      .catch(() => setError("No se pudo obtener el token de la llamada."));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!token || !url) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center">
        <div className="text-[#9aa0a6] text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#1a73e8] border-t-transparent rounded-full mx-auto mb-3" />
          <p>Conectando a la llamada…</p>
        </div>
      </div>
    );
  }

  return <MeetRoom token={token} serverUrl={url} />;
}
