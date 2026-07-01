"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleJoin = () => {
    router.push("/call");
  };

  return (
    <main className="min-h-screen bg-[#202124] flex flex-col items-center justify-center gap-8 px-4">
      {/* Disclaimer */}
      <div className="bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-full">
        Recreación con IA — no es la persona real
      </div>

      {/* Avatar placeholder */}
      <div className="w-40 h-40 rounded-full bg-[#3c4043] flex items-center justify-center text-6xl select-none">
        🎭
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Ricardo Fort IA</h1>
        <p className="text-[#9aa0a6] text-base">
          Demo de videollamada con avatar animado y voz clonada
        </p>
      </div>

      <button
        onClick={handleJoin}
        className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-lg px-10 py-4 rounded-full transition-colors duration-200 shadow-lg"
      >
        Unirse a la llamada
      </button>

      <p className="text-[#5f6368] text-xs text-center max-w-sm">
        Al unirte, activás el micrófono y te conectás al servidor de IA.
        Esta experiencia es solo para entretenimiento.
      </p>
    </main>
  );
}
