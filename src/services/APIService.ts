//export const backendURL = import.meta.env.BACKEND_URL || 'http://localhost:8080';
export const backendURL = (import.meta.env.PROD ? 'https://backend.badbird.dev/' : 'http://localhost:8080/');
