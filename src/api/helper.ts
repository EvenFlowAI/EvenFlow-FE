import { LocalTokens, SelfCustomTokens } from '../types/auth';

// SET TOKENS BLOCK
export const setAuthenticationTokenForAdmin = (accessToken: string) => {
  localStorage.setItem(LocalTokens.authToken, accessToken);
};

export const setRefreshTokenForAdmin = (refreshToken: string) => {
  localStorage.setItem(LocalTokens.refreshToken, refreshToken);
};

export const setAuthenticationTokenForSelfCustomer = (accessToken: string) => {
  localStorage.setItem(SelfCustomTokens.authToken, accessToken);
};

export const setRefreshTokenForSelfCustomer = (refreshToken: string) => {
  localStorage.setItem(SelfCustomTokens.refreshToken, refreshToken);
};

export const setSuTokens = (tokens: string) => {
  localStorage.setItem(LocalTokens.suToken, tokens);
};

// REMOVE TOKENS BLOCK
export const removeAuthenticationTokenForAdmin = () => {
  localStorage.removeItem(LocalTokens.authToken);
};

export const removeRefreshTokenForAdmin = () => {
  localStorage.removeItem(LocalTokens.refreshToken);
};

export const removeAuthenticationTokenForSelfCustomer = () => {
  localStorage.removeItem(SelfCustomTokens.authToken);
};

export const removeRefreshTokenForSelfCustomer = () => {
  localStorage.removeItem(SelfCustomTokens.refreshToken);
};

export const removeSuTokens = () => {
  localStorage.removeItem(LocalTokens.suToken);
};

// GET TOKENS BLOCK
export const getAuthenticationTokenForAdmin = () => {
  return localStorage.getItem(LocalTokens.authToken);
};

export const getAuthenticationTokenForSelfCustomer = () => {
  return localStorage.getItem(SelfCustomTokens.authToken);
};

export const getRefreshTokenForAdmin = () => {
  return localStorage.getItem(LocalTokens.refreshToken);
};

export const getRefreshTokenForSelfCustomer = () => {
  return localStorage.getItem(SelfCustomTokens.refreshToken);
};

export const getSuTokens = () => {
  return localStorage.getItem(LocalTokens.suToken);
};
