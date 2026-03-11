import axios from 'axios';
import { APIUrl } from '../config/config';
import { ITokens, LocalTokens } from '../types/auth';
import { authService } from './AuthService/AuthService';
import { Api } from './ApiEndpoints/ApiEndpoints';
import { ClientId } from '../config/tokens';
import {
  getAuthenticationTokenForAdmin,
  getAuthenticationTokenForSelfCustomer,
  setAuthenticationTokenForSelfCustomer,
  setRefreshTokenForSelfCustomer,
} from './helper';

export enum ErrorCode {
  ServiceCenterAccessDenied = 2,
}

const setSelfCustomerToken = () => {
  Api.call<ITokens>(Api.endpoints.Authentications.Anonymous, {
    data: { ClientId: ClientId },
  })
    .then(resp => {
      if (resp.data) {
        setAuthenticationTokenForSelfCustomer(resp.data.accessToken);
        setRefreshTokenForSelfCustomer(resp.data.refreshToken);
        // for setting token
        window.location.reload();
      }
    })
    .catch(err => console.error('Token for self customer page loading error: ', err));
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

  const isAdmin = getAuthenticationTokenForAdmin() != null;
  const isSelfCustomer = getAuthenticationTokenForSelfCustomer() != null;

  if (isSkippable) {
    if (!isAdmin && !isSelfCustomer) {
      // first enter - self booking, if user has not token
      setSelfCustomerToken();
      return Promise.reject(
        new Error('Skipping request - token not set yet (initial self booking)')
      );
    }

    if (!isAdmin && isSelfCustomer) {
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
      if (error?.response?.data?.errorCode === ErrorCode.ServiceCenterAccessDenied) {
        window.location.reload();
      }
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
