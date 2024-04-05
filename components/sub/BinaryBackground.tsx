"use client";

import React, { useEffect, useRef } from "react";

interface IBinaryBackground {
  timeout?: number;
  fillStyle?: string;
}

const BinaryBackground = (props: IBinaryBackground) => {
  const { timeout = 50, fillStyle = "#0f0" } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / 20) + 1;
    const yPositions: number[] = new Array(columns).fill(0);

    const matrixEffect = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)"; // Transparent background
      context.fillRect(0, 0, width, height);

      context.fillStyle = fillStyle;
      context.font = "15pt monospace";

      yPositions.forEach((y, index) => {
        const text = Math.round(Math.random()) ? "1" : "0"; // Generate binary characters
        const x = index * 20;
        context.fillText(text, x, y);

        if (y > 100 + Math.random() * 10000) {
          yPositions[index] = 0;
        } else {
          yPositions[index] = y + 20;
        }
      });
    };

    const interval = setInterval(matrixEffect, timeout);

    return () => {
      clearInterval(interval);
    };
  }, [canvasRef, timeout, fillStyle]);

  return (
    <div
      style={{
        overflow: "hidden",
        position: "fixed",
        height: "100%",
        width: "100%",
        zIndex: -1,
        left: "0",
        top: "0",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BinaryBackground;
