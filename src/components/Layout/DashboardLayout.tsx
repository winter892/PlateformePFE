import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './EncadrantSidebar';
import { ArrowLeft } from 'lucide-react';
interface DashboardLayoutProps {
  children: ReactNode;
  onProfileClick?: () => void;
}
const DashboardLayout = ({
  children,
  onProfileClick
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Ne pas afficher la flèche de retour sur la page d'accueil
  const showBackButton = location.pathname !== '/';
  return <div className="flex min-h-screen bg-slate-50">
      <Sidebar onProfileClick={onProfileClick} />
      <div className="flex-1 pl-64"> {/* Adjust this value based on sidebar width */}
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>;
};
export default DashboardLayout;