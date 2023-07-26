declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production' | 'test';
      REACT_APP_ENV?: 'uat' | 'production' | 'dev' | 'local';
      PORT?: string;
      PWD: string;
    }
  }
}

export default {}