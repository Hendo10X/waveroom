"use client"
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Logout() {
    const router = useRouter()
    const handleLogout = async () => {
        await authClient.signOut()
        router.refresh()
    }
  return (
    <div>
      <Button variant="outline" className="font-dm-mono" onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  )
}
    