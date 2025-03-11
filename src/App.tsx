
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/DashboardAdmin/Menu/Index";
import Comptes from "./pages/DashboardAdmin/Menu/Comptes";
import GestionHoraires from "./pages/DashboardAdmin/Menu/GestionHoraires";
import Statistiques from "./pages/DashboardAdmin/Menu/Statistiques";
import NotFound from "./pages/NotFound";
import Login from './pages/Login';
import Homepage from './pages/Homepage';

// Sous-pages de Gestion des horaires
import PlanningSoutenances from "./pages/DashboardAdmin/horaires/PlanningSoutenances";
import DatesLimites from "./pages/DashboardAdmin/horaires/DatesLimites";
import ActivationPlateforme from "./pages/DashboardAdmin/horaires/ActivationPlateforme";
import Parametres from "./pages/DashboardAdmin/Menu/Parametres";

import Indeex from "./pages/DashboardEtudiant/Indeex";
import Tasks from "./pages/DashboardEtudiant/Tasks";
import Profile from "./pages/DashboardEtudiant/Profile"; 
import Notifications from "./pages/DashboardEtudiant/Notifications";
import NotFouund from "./pages/DashboardEtudiant/NotFouund";

const queryClient = new QueryClient();

const App = () => (
  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/Index" element={<Index />} />
          <Route path="/comptes" element={<Comptes />} />
          <Route path="/gestion-horaires" element={<GestionHoraires />} />
          <Route path="/gestion-horaires/soutenances" element={<PlanningSoutenances />} />
          <Route path="/gestion-horaires/dates-limites" element={<DatesLimites />} />
          <Route path="/gestion-horaires/activation" element={<ActivationPlateforme />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Indeex />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFouund />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
