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
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <CameraContainer onSignDetected={setDetectedSign} />
      </div>
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">OpenSign</h1>
        <p className="text-zinc-400 mt-2">Real-time ASL Recognition</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="px-6 py-3 bg-zinc-900 rounded-full border border-zinc-800 text-white font-mono text-xl">
            Detected: {detectedSign || "..."}
          </div>
          <button
            onClick={() => setIsTtsEnabled(!isTtsEnabled)}
            className={`px-4 py-2 rounded-full font-medium ${
              isTtsEnabled
                ? "bg-cyan-500 text-black"
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
