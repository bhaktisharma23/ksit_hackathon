export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export type RequestState = "idle" | "loading" | "success" | "error";