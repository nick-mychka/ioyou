export type ValidationErrors<T = Record<string, string>> = {
  field: T; // Frontend validation
  server: Record<string, string>; // Backend validation
  general: string | null; // General error (network, etc.)
};
