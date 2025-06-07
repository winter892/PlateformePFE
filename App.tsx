
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EtudiantSidebar } from "./src/components/dashboardEtudiant/EtudiantSidebar";

// Routes et pages de votre app
import Comptes from "./src/pages/DashboardAdmin/Menu/Comptes";
import GestionHoraires from "./src/pages/DashboardAdmin/Menu/GestionHoraires";
import Statistiques from "./src/pages/DashboardAdmin/Menu/Statistiques";
import NotFound from "./src/pages/NotFound";
import Login from './src/pages/Login';
import Homepage from './src/pages/Homepage';

// Sous-pages de Gestion des horaires
import PlanningSoutenances from "./src/pages/DashboardAdmin/horaires/PlanningSoutenances";
import DatesLimites from "./src/pages/DashboardAdmin/horaires/DatesLimites";
import ActivationPlateforme from "./src/pages/DashboardAdmin/horaires/ActivationPlateforme";
import Parametres from "./src/pages/DashboardAdmin/Menu/Parametres";
import IndexEncadrant from "./src/pages/DashoardEncadrant/IndexEncadrant";
import IndexAdmin from "./src/pages/DashboardAdmin/Menu/IndexAdmin";
import GroupsPage from "./src/pages/DashoardEncadrant/GroupsPage";
import NotificationsPage from "./src/pages/DashoardEncadrant/NotificationsPage";
import StatisticsPage from "./src/pages/DashoardEncadrant/StatisticsPage";
import TeacherProfile from "./src/pages/DashoardEncadrant/TeacherProfile";
import DeliverableReviewPage from "./src/pages/DashoardEncadrant/DeliverableReviewPage";
import IndexEtudiant from "./src/pages/DashboardEtudiant/IndexEtudiant";
import Tasks from "./src/pages/DashboardEtudiant/Tasks";
import Profile from "./src/pages/DashboardEtudiant/Profile";
import Notifications from "./src/pages/DashboardEtudiant/Notifications";
import DeliverableReviewPageEtudiant from "./src/pages/DashboardEtudiant/DeliverableReviewPageEtudiant";
import AdminForm from "@/components/dashboardAdmin/AdminForm";
import SupervisorForm from "@/components/dashboardEncadrent/SupervisorForm";
import StudentForm from "@/components/dashboardEtudiant/StudentForm";
//chat
import Chat from "@/pages/DashboardEtudiant/chatEtudiant/chat";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/** Admin */}
          <Route path="/IndexAdmin" element={<IndexAdmin />} />
          <Route path="/comptes" element={<Comptes />} />
          <Route path="/gestion-horaires" element={<GestionHoraires />} />
          <Route path="/gestion-horaires/soutenances" element={<PlanningSoutenances />} />
          <Route path="/gestion-horaires/dates-limites" element={<DatesLimites />} />
          <Route path="/gestion-horaires/activation" element={<ActivationPlateforme />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/AdminForm" element={<AdminForm />} />

          {/** Encadrant */}
          <Route path="/IndexEncadrant" element={<IndexEncadrant />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/EncadrantNotifications" element={<NotificationsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/EncadrantProfile" element={<TeacherProfile />} />
          <Route path="/groups/:groupId/tasks/:taskId/deliverables/:deliverableId" element={<DeliverableReviewPage />} />
          <Route path="/SupervisorForm" element={<SupervisorForm />} />


          {/** Etudiant (Avec Sidebar) */}
          <Route path="/IndexEtudiant" element={<><EtudiantSidebar /><IndexEtudiant /></>} />
          <Route path="/tasks" element={<><EtudiantSidebar /><Tasks /></>} />
          <Route path="/Etudiantprofile" element={<><EtudiantSidebar /><Profile /></>} />
          <Route path="/EtudiantNotifications" element={<><EtudiantSidebar /><Notifications /></>} />
          <Route path="/Livrables/:deliverableId" element={<DeliverableReviewPageEtudiant />} />
          <Route path="/StudentForm" element={<StudentForm />} />


          {/** Autres */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;