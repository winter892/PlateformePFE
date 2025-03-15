import { createRoot } from 'react-dom/client';
import App from './App.tsx'; // OU './components/dashboardEtudiant/App.tsx' selon ton projet
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);
