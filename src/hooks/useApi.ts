import { useState, useEffect, useCallback } from 'react';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  total?: number;
}

interface UseApiOptions {
  page?: number;
  pageSize?: number;
  [key: string]: string | number | boolean | undefined;
}

export function useApi<T = unknown>(url: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options) {
        Object.entries(options).forEach(([k, v]) => {
          if (v !== undefined && v !== '') params.set(k, String(v));
        });
      }
      const query = params.toString();
      const fullUrl = query ? `${url}?${query}` : url;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(fullUrl, { headers });
      const json: ApiResponse<T> = await res.json();

      if (json.code === 0) {
        setData(json.data);
        if (json.total !== undefined) setTotal(json.total);
      } else {
        setError(json.message);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options), token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}

export async function apiCall<T = unknown>(
  method: string,
  url: string,
  body?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}
