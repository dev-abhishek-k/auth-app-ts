
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | undefined;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}