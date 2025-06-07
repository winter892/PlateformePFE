window.global = window;
console.log("global defined:", typeof global !== "undefined");
import { createRoot } from 'react-dom/client'
import App from '../App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);