"use client";

import { useState, useEffect, useRef } from "react";
import CameraContainer from "./components/CameraContainer";
import { speak } from "./utils/tts";

export default function Home() {
  const [detectedSign, setDetectedSign] = useState<string>("");
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(true);
  const previousSign = useRef<string>("");

  useEffect(() => {
    if (detectedSign && detectedSign !== previousSign.current && isTtsEnabled) {
      speak(detectedSign);
      previousSign.current = detectedSign;
    }
  }, [detectedSign, isTtsEnabled]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl bg-white/5">
        <CameraContainer onSignDetected={setDetectedSign} />
      </div>
      <div className="mt-8 text-center p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
        <h1 className="text-4xl font-bold text-white tracking-tight">OpenSign</h1>
        <p className="text-zinc-400 mt-2">Real-time ASL Recognition</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="px-8 py-4 bg-black/40 rounded-full border border-zinc-800 text-cyan-400 font-mono text-2xl shadow-inner">
            {detectedSign || "Waiting..."}
          </div>
          <button
            onClick={() => setIsTtsEnabled(!isTtsEnabled)}
            className={`px-6 py-4 rounded-full font-medium transition-colors ${
              isTtsEnabled
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {isTtsEnabled ? "TTS On" : "TTS Off"}
          </button>
        </div>
      </div>
    </main>
  );
}
