import axios from 'axios';
import { APIUrl } from '../config/config';
import { ITokens, LocalTokens, SelfCustomTokens } from '../types/types';
import { authService } from './AuthService/AuthService';
import { Api } from './ApiEndpoints/ApiEndpoints';
import { ClientId } from '../config/tokens';

const setSelfCustomerToken = () => {
  Api.call<ITokens>(Api.endpoints.Authentications.Anonymous, {
    data: { ClientId: ClientId },
  }).then(resp => {
    if (resp.data) {
      sessionStorage.setItem(SelfCustomTokens.authToken, resp.data.accessToken);
      sessionStorage.setItem(SelfCustomTokens.refreshToken, resp.data.refreshToken);
      // for setting token
      window.location.reload();
    }
  });
};

// List of endpoints that don't require authentication
const skipCallIfNoToken = ['/accounts/profile', '/service-centers'];

export const request = axios.create({
  baseURL: APIUrl,
  headers: {
    Authorization: authService.getLocalToken()
      ? `Bearer ${authService.getLocalToken()}`
      : undefined,
  },
});

request.interceptors.request.use(request => {
  const sessionId = sessionStorage.getItem(LocalTokens.sessionId);
  if (sessionId?.length) {
    request.headers['SessionId'] = sessionId;
  }

  const url = request.url ?? '';
  const isSkippable = skipCallIfNoToken.includes(url);

  const token = authService.getLocalToken();
  const tokenInLocalStorage = localStorage.getItem(LocalTokens.authToken) != null;
  const tokenInSessionStorage = sessionStorage.getItem(SelfCustomTokens.authToken) != null;

  if (isSkippable) {
    if (!tokenInLocalStorage && !tokenInSessionStorage) {
      // first enter - self booking, if user has not token
      setSelfCustomerToken();
      return Promise.reject(
        new Error('Skipping request - token not set yet (initial self booking)')
      );
    }

    if (!tokenInLocalStorage && tokenInSessionStorage) {
      // second or next requests in self-booking - have been canceled
      return Promise.reject(new Error('Skipping request - self booking flow'));
    }

    // if token in localStorage - don't do anything (admin flow)
  }

  return request;
});

request.interceptors.response.use(
  resp => resp,
  async error => {
    if (error?.response?.status === 401 && authService.getRefreshToken()) {
      const rq = error.config;
      try {
        await authService.refresh();
        rq.headers['Authorization'] = `Bearer ${authService.getLocalToken()}`;
        return request(rq);
      } catch (e) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
