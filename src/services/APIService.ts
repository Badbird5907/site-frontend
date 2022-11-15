//export const backendURL = import.meta.env.BACKEND_URL || 'http://localhost:8080';
// @ts-ignore - idk its broken
const isDevEnvironment = process && process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development" && false;
export const backendURL = (!isDevEnvironment ? 'https://backend.badbird.dev/' : 'http://localhost:8080/');
export function addAuthHeaders() {
    if (typeof localStorage !== 'undefined') {
        const json = localStorage.getItem('user');
        if (json === null) {
            return {};
        }
        const user = JSON.parse(json);
        if (user !== null && typeof (user) !== 'undefined') {
            return (
                {
                    headers: {
                        'Authorization': 'Bearer ' + user.token
                    }
                }
            )
        }
    }
    return {};
}
