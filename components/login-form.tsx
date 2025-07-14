"use client"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { signIn, signUp } from "@/server/users"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const formSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
})

export function LoginForm({
  
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    signIn(values.email, values.password)
    console.log(values)
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight font-bold text-center font-instrument-serif text-primary">
           Waveroom
          </CardTitle>
          <CardDescription className="font-inter text-sm text-center text-muted-foreground">
            Enter your email below to login 
          </CardDescription>
        </CardHeader> 
        <CardContent>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
              </div>
              <div className="grid gap-3"> 
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" required {...field} placeholder="**********" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <a href="#" className="ml-auto text-sm text-muted-foreground hover:text-primary hover:underline">Forgot password?</a>
              
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Login 
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                  </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
