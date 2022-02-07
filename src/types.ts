export interface ProjectInfo {
  id: string;
}

export interface ContextInfo {
  fetch: (...args: Parameters<typeof fetch>) => Promise<any>;
}