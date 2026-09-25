import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockGetModels } from "../mock/modelMock";
import type { AIModel } from "../types/model";

export async function getModels(): Promise<AIModel[]> {
  if (USE_MOCK_DATA) {
    return mockGetModels();
  }

  const response = await apiClient.get<AIModel[]>("/models");
  return response.data;
}

export async function getModel(modelId: string): Promise<AIModel> {
  const response = await apiClient.get<AIModel>(`/models/${modelId}`);
  return response.data;
}