type GtagFunction = (command: 'config' | 'event' | 'get' | 'set', ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag: GtagFunction;
  }
}

export {};
