export type HttpError = { code: string; message: string; requestId?: string };

export async function http<T>(
  input: RequestInfo,
  init?: RequestInit & { timeoutMs?: number; requestId?: string }
): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), init?.timeoutMs ?? 15000);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw { code: `HTTP_${res.status}`, message: text || res.statusText } as HttpError;
    }
    return (await res.json()) as T;
  } catch (e: any) {
    if (e.name === "AbortError") throw { code: "TIMEOUT", message: "Request timed out" } as HttpError;
    throw e as HttpError;
  } finally {
    clearTimeout(t);
  }
}


