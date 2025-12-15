import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  return (
    <div className="min-h-screen h-screen bg-muted/30 flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      {/* Desktop: margin for sidebar, Mobile: margin for top header */}
      <div className="lg:ml-60 flex-1 flex flex-col pt-14 lg:pt-0 h-screen overflow-hidden">
        <Header title={title} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
