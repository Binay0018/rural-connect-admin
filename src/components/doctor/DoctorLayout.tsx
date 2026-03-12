import { ReactNode } from 'react';
import { DoctorSidebar } from './DoctorSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DoctorHeader } from './DoctorHeader';

interface DoctorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DoctorLayout({ children, title, subtitle }: DoctorLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DoctorSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DoctorHeader title={title} subtitle={subtitle} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
