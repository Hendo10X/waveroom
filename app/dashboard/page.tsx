import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Logout } from "@/components/logout";
import { ThemeToggle } from "@/components/theme-toggle";
 
export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
 
    if(!session) {
        redirect("/login")
    }
 
    return (
        <div className="flex flex-col h-screen">
            <div className="flex justify-end p-4">
                <Logout />
                <div className="ml-2 flex items-center">
                    <ThemeToggle />
                </div>
            </div>
            
               
            
            <div className="flex justify-center items-center h-full">
                <h1 className="text-md tracking-tighter font-dm-mono">Welcome {session.user.name}</h1>
            </div>
            
        </div>
    )
}
