/** Strip HTML tags and trim message bodies. */
export function sanitizeMessageBody(body: string): string {
  return body.replace(/<[^>]*>/g, "").trim();
}
