// To handle HTTP generic errors

export interface HttpError {
  status: number;
  message: string | string[];
  error?: string;
}
