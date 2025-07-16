"use client"
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "./ui/alert-dialog";

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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="font-dm-mono" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Logout
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
           Don't want to leave? You can always come back though. Sad to see you go.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
    