
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";


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
import IndexEncadrant from "./pages/DashoardEncadrant/IndexEncadrant";
import IndexAdmin from "./pages/DashboardAdmin/Menu/IndexAdmin";
import GroupsPage from "./pages/DashoardEncadrant/GroupsPage";
import NotificationsPage from "./pages/DashoardEncadrant/NotificationsPage";
import StatisticsPage from "./pages/DashoardEncadrant/StatisticsPage";
import TeacherProfile from "./pages/DashoardEncadrant/TeacherProfile";
import DeliverableReviewPage from "./pages/DashoardEncadrant/DeliverableReviewPage";
import IndexEtudiant from "./pages/DashboardEtudiant/IndexEtudiant";
import Tasks from "./pages/DashboardEtudiant/Tasks";
import Profile from "./pages/DashboardEtudiant/Profile";
import Notifications from "./pages/DashboardEtudiant/Notifications";
import { Sidebar } from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/**Admine */}
          <Route path="/IndexAdmin" element={<IndexAdmin />} />
          <Route path="/comptes" element={<Comptes />} />
          <Route path="/gestion-horaires" element={<GestionHoraires />} />
          <Route path="/gestion-horaires/soutenances" element={<PlanningSoutenances />} />
          <Route path="/gestion-horaires/dates-limites" element={<DatesLimites />} />
          <Route path="/gestion-horaires/activation" element={<ActivationPlateforme />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/parametres" element={<Parametres />} />
          {/**Encadrant */}
          <Route path="/IndexEncadrant" element={<IndexEncadrant/>} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/profile" element={<TeacherProfile />} />
          <Route path="/groups/:groupId/tasks/:taskId/deliverables/:deliverableId" element={<DeliverableReviewPage />} />
          {/**Etudiant */}
          <Route path="/IndexEtudiant" element={<IndexEtudiant />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
           
          {/**Autres */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
