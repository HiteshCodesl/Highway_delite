"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { toast } from "sonner";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    
    const res = await axios.post("/api/send-otp", {email});

    if(res.status === 200){
      setShowOtpInput(true);
      toast("OTP Sent to your email");
    }
  }

   const checkOtp = async(e: React.FormEvent) =>{
    e.preventDefault();
      try{
        console.log(otp, "otp")
              const login = await signIn("credentials", { 
                email,
                password,
                otp,
                redirect: false,
                callbackUrl: "/",
              })

              if (login?.ok) {
                  toast.success("Login successful!");
                  router.push("/");
                } else {
                  toast.error(login?.error || "Login failed");
            }
        } catch(error){
          console.log("Error verifying OTP:", error);
          toast.error("Invalid OTP, please try again.");
        }
     }
  
  return (
    <form onSubmit={showOtpInput ? checkOtp : handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required className="text-primary text-semibold text-md" />
        </div>

          <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password"  required className="text-primary text-semibold text-md" />
        </div>

      {showOtpInput && <div className="grid gap-3">
         <Label htmlFor="otp">Otp</Label>
         <InputOTP maxLength={6} aria-label="OTP" className="w-full" value={otp} onChange={(value) => setOtp(value)}>

        <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
        
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
        </InputOTPGroup>
        </InputOTP>
       </div>
      }
         
        <Button type="submit" className="w-full btn-primary hover:cursor-pointer">
          {showOtpInput? 'verify OTP & Login' : 'Send OTP'}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
       
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}

