import VendorSidebar from "@/components/layout/VendorSidebar";
import { Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <VendorSidebar />
      
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-card border-b px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="font-medium text-muted-foreground text-sm">
            Selamat datang kembali, <span className="font-bold text-foreground">KL Makeup Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex items-center gap-2 cursor-pointer">
              <UserCircle className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
