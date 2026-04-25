export async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json() as Promise<T>;
}

export async function postJSON<TResponse, TPayload>(url: string, payload: TPayload): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json() as Promise<TResponse>;
}

export const api = {
  health: () => getJSON<{ ok: boolean; service: string; timestamp: string }>('/api/health'),
  listResults: () =>
    getJSON<{
      ok: boolean;
      items: Array<{ id: number; archetypeId: string; scoreVector: Record<string, number>; createdAt: string }>;
    }>('/api/results'),
  saveResult: (payload: { archetypeId: string; scoreVector: Record<string, number>; createdAt?: string }) =>
    postJSON<{ ok: boolean }, typeof payload>('/api/results', payload)
};
