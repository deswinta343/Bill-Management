import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";

// Import Laravel Echo dan Pusher
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Konfigurasi Pusher
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '92d0b93bdd5aa3b20b75', // Ganti dengan kunci Pusher Anda
  cluster: 'ap1', // Ganti dengan cluster Pusher Anda
  forceTLS: true
});

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <SoftUIControllerProvider>
      <App />
    </SoftUIControllerProvider>
  </HashRouter>
);
