//export const backendURL = import.meta.env.BACKEND_URL || 'http://localhost:8080';
export const backendURL = (import.meta.env.PROD ? 'https://backend.badbird.dev/' : 'http://localhost:8080/');
export function addAuthHeaders() {
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
    return {};
}
