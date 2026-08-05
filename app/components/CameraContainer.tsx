"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Hands, Results } from "@mediapipe/hands";
import { classifyHand } from "../utils/classifier";

interface Props {
  onSignDetected: (sign: string) => void;
}

export default function CameraContainer({ onSignDetected }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hands, setHands] = useState<Hands | null>(null);

  useEffect(() => {
    const handsInstance = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handsInstance.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    handsInstance.onResults(onResults);
    setHands(handsInstance);

    return () => {
      handsInstance.close();
    };
  }, []);

  useEffect(() => {
    if (!hands) return;

    const runDetection = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        await hands.send({ image: webcamRef.current.video });
      }
      requestAnimationFrame(runDetection);
    };

    const animationFrame = requestAnimationFrame(runDetection);
    return () => cancelAnimationFrame(animationFrame);
  }, [hands]);

  const onResults = (results: Results) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvasCtx = canvasElement.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw landmarks
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Classify
        const sign = classifyHand(landmarks);
        if (sign) onSignDetected(sign);

        for (const landmark of landmarks) {
          canvasCtx.beginPath();
          canvasCtx.arc(
            landmark.x * canvasElement.width,
            landmark.y * canvasElement.height,
            2,
            0,
            2 * Math.PI
          );
          canvasCtx.fillStyle = "white";
          canvasCtx.fill();
        }
      }
    }
    canvasCtx.restore();
  };

  return (
    <div className="relative w-full h-full">
      <Webcam
        ref={webcamRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={640}
        height={480}
      />
    </div>
  );
}
