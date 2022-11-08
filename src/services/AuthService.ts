import axios from "axios";
import {backendURL} from "./APIService";

const API_URL = backendURL + "auth/";

class AuthService {
    // @ts-ignore
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                } else {
                    console.log('??', response.data);
                }

                return response.data;
            });
    }

    logout() {
        if (!this.isLoggedIn()) return null;
        return axios.post(API_URL + "logout", {}, {
            headers: {
                Authorization: "Bearer " + this.getCurrentUser().token
            }
        })
    }

    checkTokenValid() {
        const token = this.getCurrentUser().token;
        console.log('Checking token:', token)
        return axios
            .post(API_URL + "check", {
                token: token
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            }).then(response => {
                if (response.data) {
                    const a = response.data.success;
                    console.log('Token valid:', a)
                    if (!a) {
                        window.location.href = "/signout"
                    } else {
                        const username = response.data.username;
                        const roles = response.data.roles;

                        const currentUser = this.getCurrentUser();
                        currentUser.username = username;
                        currentUser.roles = roles;

                        localStorage.setItem("user", JSON.stringify(currentUser));
                    }
                }
            });
    }

    changePassword(password: string, oldPassword: string) {
        const token = this.getCurrentUser().token;
        return axios.post(API_URL + "changepwd", {
            newPassword: password,
            oldPassword: oldPassword
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
    }

    getCurrentUser() {
        const json = localStorage.getItem('user');
        if (json === null) {
            return null;
        }
        return JSON.parse(json);
    }

    isLoggedIn() {
        const user = this.getCurrentUser();
        return user !== null && typeof (user) !== 'undefined';
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user !== null && user.roles.includes("ROLE_ADMIN");
    }
}

export default new AuthService();
