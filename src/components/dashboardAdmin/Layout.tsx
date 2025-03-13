
import React from "react";
import Sidebar from "./AdminSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar />
      <div className="pl-64 w-full">
        <main className="p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
