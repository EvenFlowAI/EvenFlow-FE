import {ICredentials, IRefreshTokenData, ITokens, LocalTokens} from "../../types/types";
import {API} from "../api";
import {request} from "../request";
import {Api} from "../ApiEndpoints/ApiEndpoints";

class AuthService {
    getLocalToken(): string {
        return localStorage.getItem(LocalTokens.authToken) || '';
    }

    getRefreshToken(): string {
        return localStorage.getItem(LocalTokens.refreshToken) || '';
    }

    setTokens({accessToken, refreshToken}: ITokens): void {
        localStorage.setItem(LocalTokens.authToken, accessToken);
        localStorage.setItem(LocalTokens.refreshToken, refreshToken);
    }

    setDealershipTokens({accessToken, refreshToken}: ITokens) {
        const tokens: ITokens = {
            accessToken: this.getLocalToken(),
            refreshToken: this.getRefreshToken()
        };
        localStorage.setItem(LocalTokens.suToken, JSON.stringify(tokens));
        localStorage.setItem(LocalTokens.authToken, accessToken);
        localStorage.setItem(LocalTokens.refreshToken, refreshToken);
    }

    isAuthenticated(): boolean {
        return !!this.getLocalToken();
    }

    refreshRequest(): void {
        const token = this.getLocalToken();
        if (token) {
            request.defaults.headers['Authorization'] = `Bearer ${token}`;
            request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete request.defaults.headers['Authorization'];
            delete request.defaults.headers.common['Authorization'];
        }
    }

    async refresh() {
        try {
            const data: IRefreshTokenData = {token: this.getRefreshToken()};
            const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Refresh, {data});
            this.setTokens(resp.data);
            this.refreshRequest();
        } catch (e) {
            this.logout();
            console.log('refresh error', e)
        }
    }

    async dealershipLogin(dealershipId: number) {
        try {
            const {data: tokens} = await API.authentication.dealership(dealershipId);
            this.setDealershipTokens(tokens);
            this.refreshRequest();
        } catch (e) {
            console.error(e);
        }
    }

    async login(data: ICredentials) {
        const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Request, {data});
        this.setTokens(resp.data);
        this.refreshRequest();
    }

    logout(): void {
        localStorage.removeItem(LocalTokens.authToken);
        localStorage.removeItem(LocalTokens.refreshToken);
        const suTokens = localStorage.getItem(LocalTokens.suToken);
        if (suTokens) {
            localStorage.removeItem(LocalTokens.suToken);
            this.setTokens(JSON.parse(suTokens) as ITokens);
        }
        this.refreshRequest();
    }
}

export const authService = new AuthService();