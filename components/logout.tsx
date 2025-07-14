"use client"
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Logout() {
  const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleLogout = async () => {
      try {
        setIsLoading(true)
        await authClient.signOut()
        router.refresh()
        toast.success("Logged out successfully")
      } catch (error) {
        console.error(error)
        toast.error("Failed to logout")
      } 
    }
  return (
    <div>
      <Button variant="outline" className="font-dm-mono" onClick={handleLogout} disabled={isLoading}>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
        Logout
      </Button>
    </div>
  )
}
    