import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AdminHeader() {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out.",
      });
    }
  };
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="hidden md:flex items-center gap-2 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}