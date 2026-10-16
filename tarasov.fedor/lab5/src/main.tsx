import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.querySelector('[data-testid="app"]')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
