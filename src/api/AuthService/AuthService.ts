import { ICredentials, IRefreshTokenData, ITokens, LocalTokens } from '../../types/auth';
import { API } from '../api';
import { ErrorCode, request } from '../request';
import { Api } from '../ApiEndpoints/ApiEndpoints';
import { authChannel } from '../../index';
import { ADMIN_TOKEN_UPDATED } from '../../config/data';
import {
  getAuthenticationTokenForAdmin,
  getAuthenticationTokenForSelfCustomer,
  getRefreshTokenForAdmin,
  getRefreshTokenForSelfCustomer,
  getSuTokens,
  removeAuthenticationTokenForAdmin,
  removeAuthenticationTokenForSelfCustomer,
  removeRefreshTokenForAdmin,
  removeRefreshTokenForSelfCustomer,
  removeSuTokens,
  setAuthenticationTokenForAdmin,
  setAuthenticationTokenForSelfCustomer,
  setRefreshTokenForAdmin,
  setRefreshTokenForSelfCustomer,
  setSuTokens,
} from '../helper';

class AuthService {
  getLocalToken(): string {
    return getAuthenticationTokenForAdmin() || getAuthenticationTokenForSelfCustomer() || '';
  }

  getRefreshToken(): string {
    return getRefreshTokenForAdmin() || getRefreshTokenForSelfCustomer() || '';
  }

  setTokenForRefresh({ accessToken, refreshToken }: ITokens) {
    if (getAuthenticationTokenForAdmin()) {
      setAuthenticationTokenForAdmin(accessToken);
      setRefreshTokenForAdmin(refreshToken);
    }
    if (getAuthenticationTokenForSelfCustomer()) {
      setAuthenticationTokenForSelfCustomer(accessToken);
      setRefreshTokenForSelfCustomer(refreshToken);
    }
  }

  setTokens({ accessToken, refreshToken }: ITokens): void {
    // set token for admin
    setAuthenticationTokenForAdmin(accessToken);
    setRefreshTokenForAdmin(refreshToken);

    // remove token for self-customer, because it is an admin login
    removeAuthenticationTokenForSelfCustomer();
    removeRefreshTokenForSelfCustomer();

    // send a message for reload all pages with opened booking/admin-panel
    authChannel.postMessage({
      type: ADMIN_TOKEN_UPDATED,
    });
  }

  setDealershipTokens({ accessToken, refreshToken }: ITokens) {
    const tokens: ITokens = {
      accessToken: this.getLocalToken(),
      refreshToken: this.getRefreshToken(),
    };
    setSuTokens(JSON.stringify(tokens));
    setAuthenticationTokenForAdmin(accessToken);
    setRefreshTokenForAdmin(refreshToken);
  }

  isAuthenticated(): boolean {
    return !!getAuthenticationTokenForAdmin();
  }

  syncRequestAuthWithLocalStorage(): void {
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
      this.setTokenForRefresh(resp.data);
      this.syncRequestAuthWithLocalStorage();
      return resp.data.accessToken;
    } catch (e) {
      // for refresh dead token
      removeAuthenticationTokenForSelfCustomer();
      removeRefreshTokenForSelfCustomer();
      removeAuthenticationTokenForAdmin();
      removeRefreshTokenForAdmin();

      // send a message for reload all pages with opened booking/admin-panel
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });

      // reload current page
      window.location.reload();
    }
  }

  async dealershipLogin(dealershipId: number) {
    try {
      const response = await API.authentication.dealership(dealershipId);

      console.log(response);
      this.setDealershipTokens(response.data);

      // send a message for reload all pages with opened booking/admin-panel
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });
      this.syncRequestAuthWithLocalStorage();
    } catch (e: any) {
      if (e?.response?.data?.errorCode === ErrorCode.ServiceCenterAccessDenied) {
        window.location.reload();
      }
      console.error(e);
    }
  }

  async login(data: ICredentials) {
    // TODO: IT IS TEMPORARY FIX, FOR CLEAR ALL SESSION STORAGE REGARDING OUR PAST LOGIC, delete it after 15.07.2025
    if (sessionStorage.getItem(LocalTokens.authToken)) {
      sessionStorage.removeItem(LocalTokens.authToken);
    }

    if (sessionStorage.getItem(LocalTokens.refreshToken)) {
      sessionStorage.removeItem(LocalTokens.refreshToken);
    }

    const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Request, { data });
    this.setTokens(resp.data);
    this.syncRequestAuthWithLocalStorage();
  }

  logout(): void {
    // remove admin tokens
    removeAuthenticationTokenForAdmin();
    removeRefreshTokenForAdmin();

    const suTokens = getSuTokens();
    if (suTokens) {
      removeSuTokens();
      this.setTokens(JSON.parse(suTokens) as ITokens);
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });
    } else {
      authChannel.postMessage({
        type: ADMIN_TOKEN_UPDATED,
      });
    }
    this.syncRequestAuthWithLocalStorage();
  }
}

export const authService = new AuthService();
