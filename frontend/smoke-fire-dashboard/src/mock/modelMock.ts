import type { AIModel } from "../types/model";

export async function mockGetModels(): Promise<AIModel[]> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            id: "model-1",
            name: "SmokeFireDetector",
            version: "v1.0",
            framework: "YOLO11",
            classes: ["smoke", "fire"],
            metrics: {
              accuracy: 0.912,
              precision: 0.897,
              recall: 0.884,
              mAP: 0.901,
            },
            status: "active",
          },
        ]),
      300
    );
  });
}