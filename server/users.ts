"use server";
import { auth } from "@/lib/auth"
 
export const signIn = async (email: string, password: string) => {
    try{
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })    
        return { success: true, message: "Signed in successfully" }
    }
    catch(error){
        console.error(error, "Error signing in")
        return { success: false, message: "Invalid email or password" }
    }
}

export const signUp = async (name: string, email: string, password: string) => {
    try{
        await auth.api.signUpEmail({
            body: {
            name,
            email,
            password,
        }
        })
        return { success: true, message: "Signed up successfully" }
    }
    catch(error){
        console.error(error, "Error signing up")
        return { success: false, message: "Invalid email or password" }
    }
}



