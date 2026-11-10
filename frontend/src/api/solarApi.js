import { useState, useCallback } from 'react';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const useSolarData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSolarData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      );
      const response = await fetch(`${API_BASE_URL}/solar?${qs}`);
      if (!response.ok) {
        let detail = `Error: ${response.status}`;
        try {
          const body = await response.json();
          if (body?.detail) {
            detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
          }
        } catch { /* ignore non-JSON error bodies */ }
        throw new Error(detail);
      }
      const json = await response.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message || 'Failed to reach the backend');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchSolarData };
};
