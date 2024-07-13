'use client';

import React, { useRef, useEffect } from 'react';

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.lineCap = 'round';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function startDrawing(e: MouseEvent) {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e: MouseEvent) {
      if (!isDrawing) return;
      context?.beginPath();
      context?.moveTo(lastX, lastY);
      context?.lineTo(e.offsetX, e.offsetY);
      context?.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, []);

  return (
    <div className="w-full h-[calc(100vh-10rem)] overflow-y-scroll">
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-300 bg-white"
      />
    </div>
  );
}