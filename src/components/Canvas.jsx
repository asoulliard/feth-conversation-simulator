import { useRef, useEffect } from "react";

export default function Canvas({
  onCanvas,
  onDraw,
  name,
  portrait,
  reversePortrait,
  emotion,
  color,
  reverseFrame,
  text,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    onCanvas(canvasRef.current);
  });

  useEffect(() => {
    const context = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    onDraw(context);
  }, [name, portrait, reversePortrait, emotion, color, reverseFrame, text]);

  return (
    <canvas
      className="w-100"
      width={1728}
      height={554}
      ref={canvasRef}
    ></canvas>
  );
}
