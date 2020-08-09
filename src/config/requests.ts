import axios from "axios";
import {APIUrl} from "./config";
import {ICredentials, ITokens, LocalTokens} from "../types/types";


class AuthService {
    getLocalToken (): string {
        return localStorage.getItem(LocalTokens.authToken) || '';
    }
    setTokens ({accessToken, refreshToken}: ITokens): void {
        localStorage.setItem(LocalTokens.authToken, accessToken);
        localStorage.setItem(LocalTokens.refreshToken, refreshToken);
    }

    isAuthenticated (): boolean {
        return !!this.getLocalToken();
    }

    refreshRequest (): void {
        const token = this.getLocalToken();
        if (token) {
            request.defaults.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete request.defaults.headers['Authorization'];
        }
    }

    async login(credentials: ICredentials) {
        try {
            const resp = await request.post<ITokens>('authentications', credentials);
            this.setTokens(resp.data);
            this.refreshRequest()
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    logout(): void {
        localStorage.removeItem(LocalTokens.authToken);
        localStorage.removeItem(LocalTokens.refreshToken);
        this.refreshRequest();
    }
}

export const request = axios.create({
    baseURL: APIUrl
});

export const authService = new AuthService();