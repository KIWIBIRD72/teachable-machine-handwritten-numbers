import { useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import path from "path";

// from cloud
const MODEL_PATH = "https://teachablemachine.withgoogle.com/models/eIa4D2Xw-/";

// local path from public/model project folder
// const MODEL_PATH = "model/";

export const useModel = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);

  useEffect(() => {
    async function loadModel() {
      const modelURL = path.join(MODEL_PATH, "model.json");
      const metadataURL = path.join(MODEL_PATH, "metadata.json");

      // load the model and metadata
      const createdModel = await tmImage.load(modelURL, metadataURL);
      setModel(createdModel);
    }

    if (!model) {
      loadModel();
    }
  }, [model]);

  return model;
};
