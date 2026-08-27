export type ValidationResult =
  | { valid: true; message?: undefined }
  | { valid: false; message: string };

export const valid = (): ValidationResult => ({ valid: true });

export function required(
  value: unknown,
  message = 'This field is required.'
): ValidationResult {
  const missing = value == null
    || (typeof value === 'string' && value.trim().length === 0)
    || (Array.isArray(value) && value.length === 0);

  return missing ? { valid: false, message } : valid();
}
