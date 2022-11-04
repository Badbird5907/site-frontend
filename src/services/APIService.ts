//export const backendURL = import.meta.env.BACKEND_URL || 'http://localhost:8080';
import {Axios} from "axios";

export const backendURL = (import.meta.env.PROD ? 'https://backend.badbird.dev/' : 'http://localhost:8080/');
export function addAuthHeaders() {
    const token = localStorage.getItem('token');
    if (token) {
        return (
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )
    }
    return {};
}
