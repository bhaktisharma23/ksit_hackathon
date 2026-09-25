import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}