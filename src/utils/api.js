// Simple API helper for SmartLearn frontend
// Provides:
// - base API URL resolution
// - auth header injection using token from localStorage
// - small wrapper around fetch with JSON handling

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function getUserType() {
  return localStorage.getItem('userType');
}

export function authHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const detail = await safeParseError(res);
    throw new Error(detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await safeParseError(res);
    throw new Error(detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

async function safeParseError(res) {
  try {
    const data = await res.json();
    if (data && (data.detail || data.message)) {
      return data.detail || data.message;
    }
  } catch (_) {
    // ignore JSON parse errors
  }
  return null;
}


