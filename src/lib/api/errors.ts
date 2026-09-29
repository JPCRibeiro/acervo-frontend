import { AxiosError } from "axios";

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  status: number;
  fieldErrors: FieldError[];
  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    if (!error.response) {
      const timeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
      const message = timeout
        ? "A requisição demorou demais. Tente novamente."
        : "Não foi possível conectar ao servidor. Tente novamente em instantes.";
      return new ApiError(message, 0);
    }

    const body = error.response.data as
      | { error?: string; fieldErrors?: FieldError[] }
      | undefined;
    const status = error.response.status;
    const message = body?.error ?? error.message ?? "Erro inesperado";
    return new ApiError(message, status, body?.fieldErrors ?? []);
  }
  return new ApiError("Erro inesperado", 0);
}