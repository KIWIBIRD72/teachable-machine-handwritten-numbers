"use client";

import { useModel } from "@/shared/hooks/useModel";
import { useScreenDimensions } from "@/shared/hooks/useScreenDimensions";
import { IconButton } from "@/shared/ui/IconButton";
import { CanvasDrawRef, DrawingCanvas } from "@/widget/DrawCanvas";
import { CustomMobileNet } from "@teachablemachine/image";
import { Check, Delete, Eraser } from "lucide-react";
import { useRef, useState } from "react";

const CANVAS_PADDINGS = 16;
const MIN_PREDICTION_PERCENT = 0.2;
const MAX_PHONE_NUMBER_LENGTH = 11;

type PredictionRes = Awaited<ReturnType<CustomMobileNet["predict"]>>;

export default function Home() {
  const canvasRef = useRef<null | CanvasDrawRef>(null);
  const dimensions = useScreenDimensions();
  const model = useModel();
  const [phoneNumber, setPhoneNumber] = useState("+7");

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  const getPredictedClass = (predictions: PredictionRes) => {
    const maxPrediction = predictions.reduce((max, current) => {
      return current.probability > max.probability ? current : max;
    });

    if (maxPrediction.probability > MIN_PREDICTION_PERCENT) {
      return parseInt(maxPrediction.className.split(" ")[1]);
    } else {
      return null;
    }
  };

  const analyzeNumber = async (image: ImageBitmap) => {
    const predict = await model?.predict(image);

    if (!predict) return;

    const predictionNumberRes = getPredictedClass(predict);

    if (predictionNumberRes) {
      setPhoneNumber((state) => {
        if (state.length > MAX_PHONE_NUMBER_LENGTH) return state;
        return state + predictionNumberRes;
      });
    }
  };

  const deletePhoneNumber = () => {
    setPhoneNumber((state) => {
      if (state === "+7") return "+7";
      return state.slice(0, -1);
    });
  };

  const handleUrlData = async () => {
    const canvasImgUrl = canvasRef.current?.getDataURL("jpg", true, "#ffffff");
    if (!canvasImgUrl) return;

    canvasRef.current?.clear();

    const base64Image = canvasImgUrl.split(",")[1]; // Извлекаем только часть данных base64

    // Создаем объект Image
    const image = new Image();
    image.src = `data:image/png;base64,${base64Image}`;

    image.onload = function () {
      // Создаем Canvas для рисования
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;

      // Закрашиваем фон выбранным цветом (например, белым)
      ctx.fillStyle = "white"; // Задайте нужный цвет фона
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Закрашиваем весь холст

      // Рисуем изображение на Canvas
      ctx.drawImage(image, 0, 0);

      // Получаем ImageBitmap
      createImageBitmap(canvas).then(async (imageBitmap) => {
        analyzeNumber(imageBitmap);
      });
    };
  };

  return (
    <div className="">
      <div className="flex w-full items-center justify-center">
        <DrawingCanvas
          className="my-[16px] overflow-hidden rounded-3xl border-[3px] border-indigo-800"
          ref={canvasRef}
          width={dimensions.width - CANVAS_PADDINGS * 2}
          height={dimensions.width - CANVAS_PADDINGS * 2}
        />
      </div>

      <div className="flex w-full justify-center gap-3">
        <IconButton onClick={handleClearCanvas} className="bg-yellow-500">
          <Eraser color="#ffffff" />
        </IconButton>
        <IconButton
          onClick={handleUrlData}
          disabled={phoneNumber.length >= MAX_PHONE_NUMBER_LENGTH}
          className={phoneNumber.length >= MAX_PHONE_NUMBER_LENGTH ? "opacity-50" : ""}
        >
          <Check color="#ffffff" />
        </IconButton>
      </div>

      <div className="flex w-full flex-col items-center justify-center py-10">
        <h3 className="text-[20px] font-normal">Enter phone number:</h3>

        <div className="!mx-4 flex w-full items-center justify-between">
          <div className="h-[48px] w-[48px]" />

          <h5 className="line-clamp-1 text-[30px] font-bold">{phoneNumber}</h5>

          <button onClick={deletePhoneNumber} className="p-3">
            <Delete />
          </button>
        </div>
      </div>
    </div>
  );
}
