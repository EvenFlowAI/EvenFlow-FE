import axios from 'axios';
import { APIUrl } from '../config/config';
import { LocalTokens } from '../types/types';
import { authService } from './AuthService/AuthService';

export const request = axios.create({
  baseURL: APIUrl,
  headers: { Authorization: `Bearer ${authService.getLocalToken()}` },
});

request.interceptors.request.use(request => {
  const sessionId = sessionStorage.getItem(LocalTokens.sessionId);
  if (sessionId?.length) request.headers['SessionId'] = sessionId;
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
