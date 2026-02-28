const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

export const REVIEW_API_URL = `${baseUrl}/review`;
