import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavBar from "./MobileNavBar";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      
      <MobileNavBar />
    </div>
  );
}
