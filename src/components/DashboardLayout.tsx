"use client";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen">
      {/* ✅ Sidebar is already handled in layout.tsx */}
      <main className="flex-1 transition-all duration-300 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
