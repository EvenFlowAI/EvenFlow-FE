import axios from 'axios';
import { APIUrl } from '../config/config';
import { LocalTokens } from '../types/types';
import { authService } from './AuthService/AuthService';

// List of endpoints that don't require authentication
const skipCallIfNoToken = ['/accounts/profile', '/service-centers']

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
  if (sessionId?.length) request.headers['SessionId'] = sessionId;
  if (skipCallIfNoToken.includes(request.url ?? '') && !authService.getLocalToken()) {
    return Promise.reject(new Error('Skipping request - no token available'));
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
