// \portfolio-showcase\src\main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1) Import HelmetProvider from react-helmet-async
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2) Wrap <App /> in the <HelmetProvider> */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);