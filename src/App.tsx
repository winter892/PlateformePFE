
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Comptes from "./pages/Comptes";
import GestionHoraires from "./pages/GestionHoraires";
import Statistiques from "./pages/Statistiques";
import NotFound from "./pages/NotFound";

// Sous-pages de Gestion des horaires
import PlanningSoutenances from "./pages/horaires/PlanningSoutenances";
import DatesLimites from "./pages/horaires/DatesLimites";
import ActivationPlateforme from "./pages/horaires/ActivationPlateforme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/comptes" element={<Comptes />} />
          <Route path="/gestion-horaires" element={<GestionHoraires />} />
          <Route path="/gestion-horaires/soutenances" element={<PlanningSoutenances />} />
          <Route path="/gestion-horaires/dates-limites" element={<DatesLimites />} />
          <Route path="/gestion-horaires/activation" element={<ActivationPlateforme />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
