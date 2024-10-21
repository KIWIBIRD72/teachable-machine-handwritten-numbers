"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
// import Background from "@/public/bg.jpg";

export type CanvasDrawRef = {
  clear: () => void;
  getDataURL: (fileType: "png" | "jpg", useBgImage?: boolean, backgroundColour?: string) => string;
  canvasContainer: HTMLCanvasElement;
  canvas: HTMLCanvasElement;
};

type DrawingCanvasProps = {
  width: number;
  height: number;
  className?: string;
};

const settings = {
  loadTimeOffset: 1,
  lazyRadius: 0,
  brushRadius: 20,
  brushColor: "#000000",
  catenaryColor: "#ffffff",
  gridColor: "#ffffff",
  hideGrid: true,
  imgSrc: "#000000",
  // imgSrc: Background.src,
};

export const DrawingCanvas = forwardRef<CanvasDrawRef | null | unknown, DrawingCanvasProps>(
  (props, ref) => {
    const [setsizes, setSetsizes] = useState<{ width: number; height: number } | null>(null);
    const canvasRef = useRef<null | CanvasDrawRef>(null);

    useImperativeHandle(ref, () => {
      return canvasRef.current;
    });

    useEffect(() => {
      setSetsizes({ width: props.width, height: props.height });
    }, [props.height, props.width]);

    if (!setsizes) return null;

    return (
      <CanvasDraw
        className={props.className}
        ref={canvasRef}
        {...settings}
        canvasWidth={setsizes.width}
        canvasHeight={setsizes.height}
      />
    );
  },
);

DrawingCanvas.displayName = "DrawingCanvas";
