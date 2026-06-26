/** Standard API validation error shape returned by backend endpoints. */
export interface ValidationFieldError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  error: "VALIDATION_ERROR";
  message: string;
  fields: ValidationFieldError[];
}

export type FieldErrorsMap = Record<string, string>;
