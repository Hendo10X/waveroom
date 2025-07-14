"use client"
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function Logout() {
    const handleLogout = async () => {
        await authClient.signOut()
    }
  return (
    <div>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  )
}
    