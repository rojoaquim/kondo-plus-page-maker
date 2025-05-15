
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configurar para que o console.log mostre timestamps
const originalConsoleLog = console.log;
console.log = function() {
  const timestamp = new Date().toISOString();
  originalConsoleLog.apply(console, [`[${timestamp}]`, ...arguments]);
};

createRoot(document.getElementById("root")!).render(<App />);
