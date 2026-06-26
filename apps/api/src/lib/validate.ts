import type { z, ZodTypeAny } from "zod";
import { buildValidationErrorResponse } from "@getyourboat/shared";
import { HttpError } from "./errors.js";

/** Parses input with a Zod schema, throwing a 400 HttpError on failure. */
export function parse<S extends ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  return parseDetailed(schema, data);
}

/** Like `parse` but attaches standardized field-level validation errors. */
export function parseDetailed<S extends ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const payload = buildValidationErrorResponse(result.error);
    const err = new HttpError(400, payload.message, "VALIDATION_ERROR");
    (err as HttpError & { details?: unknown; fields?: typeof payload.fields }).details = payload;
    (err as HttpError & { fields?: typeof payload.fields }).fields = payload.fields;
    throw err;
  }
  return result.data;
}
