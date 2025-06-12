export interface ServerError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
