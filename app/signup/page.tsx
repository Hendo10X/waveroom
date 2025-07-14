import { SignupForm } from "@/components/signup-form"

export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-sm">
            <SignupForm />
        </div>
    </div>
  )
}