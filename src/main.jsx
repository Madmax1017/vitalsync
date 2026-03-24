import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Suppress known third-party deprecation and shader precision warnings from Three.js/R3F
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg1 = typeof args[0] === 'string' ? args[0] : '';
  const msg2 = typeof args[1] === 'string' ? args[1] : '';

  if (msg1.includes('THREE.Clock: This module has been deprecated')) return;
  if (msg1.includes('THREE.WebGLProgram: Program Info Log:') && msg2.includes('warning X4122')) return;

  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)