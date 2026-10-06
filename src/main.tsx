import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register and update PWA service worker
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('PM Kisan Urvarak PWA is ready for offline operation.');
  },
  onNeedRefresh() {
    console.log('New PM Kisan app version available.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
