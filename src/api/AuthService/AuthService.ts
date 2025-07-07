import {
  ICredentials,
  IRefreshTokenData,
  ITokens,
  ITokensWithLoginFlag,
  LocalTokens,
  SelfCustomTokens,
} from '../../types/types';
import { API } from '../api';
import { request } from '../request';
import { Api } from '../ApiEndpoints/ApiEndpoints';
import { authChannel } from '../../index';
import { ADMIN_TOKEN_UPDATED } from '../../config/data';

class AuthService {
  getLocalToken(): string {
    return (
      localStorage.getItem(LocalTokens.authToken) ||
      localStorage.getItem(SelfCustomTokens.authToken) ||
      ''
    );
  }

  getRefreshToken(): string {
    return (
      localStorage.getItem(LocalTokens.refreshToken) ||
      localStorage.getItem(SelfCustomTokens.refreshToken) ||
      ''
    );
  }

  setTokens({ accessToken, refreshToken, isAdminToken }: ITokensWithLoginFlag): void {
    if (isAdminToken) {
      // set token for admin
      localStorage.setItem(LocalTokens.authToken, accessToken);
      localStorage.setItem(LocalTokens.refreshToken, refreshToken);

      // remove token for self customer
      localStorage.removeItem(SelfCustomTokens.authToken);
      localStorage.removeItem(SelfCustomTokens.refreshToken);

      // send a message for reload all pages with opened self-customer pages
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });
      return;
    }

    // for refresh token
    if (localStorage.getItem(LocalTokens.authToken)) {
      localStorage.setItem(LocalTokens.authToken, accessToken);
      localStorage.setItem(LocalTokens.refreshToken, refreshToken);
    }
    if (localStorage.getItem(SelfCustomTokens.authToken)) {
      localStorage.setItem(SelfCustomTokens.authToken, accessToken);
      localStorage.setItem(SelfCustomTokens.refreshToken, refreshToken);
    }
  }

  setDealershipTokens({ accessToken, refreshToken }: ITokens) {
    const tokens: ITokens = {
      accessToken: this.getLocalToken(),
      refreshToken: this.getRefreshToken(),
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
      const data: IRefreshTokenData = { token: this.getRefreshToken() };
      const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Refresh, { data });
      this.setTokens(resp.data);
      this.refreshRequest();
    } catch (e) {
      this.logout();
      console.log('refresh error', e);
    }
  }

  async dealershipLogin(dealershipId: number) {
    try {
      const { data: tokens } = await API.authentication.dealership(dealershipId);
      this.setDealershipTokens(tokens);
      this.refreshRequest();
    } catch (e) {
      console.error(e);
    }
  }

  async login(data: ICredentials) {
    if (sessionStorage.getItem(LocalTokens.authToken)) {
      sessionStorage.setItem(LocalTokens.authToken, '');
    }

    if (sessionStorage.getItem(LocalTokens.refreshToken)) {
      sessionStorage.setItem(LocalTokens.refreshToken, '');
    }

    const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Request, { data });
    this.setTokens({ ...resp.data, isAdminToken: true });
    this.refreshRequest();
  }

  logout(): void {
    localStorage.removeItem(LocalTokens.authToken);
    localStorage.removeItem(LocalTokens.refreshToken);
    const suTokens = localStorage.getItem(LocalTokens.suToken);
    if (suTokens) {
      localStorage.removeItem(LocalTokens.suToken);
      this.setTokens({ ...(JSON.parse(suTokens) as ITokens), isAdminToken: true });
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });
    } else {
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });
    }
    this.refreshRequest();
  }
}

export const authService = new AuthService();
