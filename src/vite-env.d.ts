/// <reference types="vite/client" />

import type { BubbleDemo } from "./demo/bubbleDemo";

declare global {
  interface Window {
    __playproofDemo?: BubbleDemo;
  }
}

export {};
