"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils"
import React, { useState } from "react";
import axios from "axios"
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { toast } from "sonner";

export default function page({
  className,
}: React.ComponentProps<"form">) {

    const router = useRouter();
    const [email,setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const signupRequest = async(e: React.FormEvent) =>{
        e.preventDefault();
        if(loading) return;
        setLoading(true);

        try{
        const data = {email, name, password}
        const response = await axios.post("/api/auth/register", data);

        if(response.status === 200){
           setShowOtpInput(true);
          
             await axios.post("/api/send-otp", {email});
            }
          }catch(err){
             console.log("Error sending OTP:", err);
          }finally{
            setLoading(false);
          }
  }      
     const checkOtp = async() =>{
      try{
         const res = await axios.post("/api/verify-otp", {email, otp});

          if(res.status === 200){
             setShowOtpInput(false);
                router.push("/");
              }
      } catch(error){
          console.log("Error verifying OTP:", error);
          toast.error("Invalid OTP, please try again.");
        }
     }

  return (

     <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className=" flex size-6 items-center justify-center ">
             <Image
               src={"/logo.png"}
               alt="Logo"
               width={24}
               height={24} 
                />
              </div>
            HD
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
             <form onSubmit={signupRequest} className={cn("flex flex-col gap-6 ", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-primary">Sign up to an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to signup into your account
        </p>
      </div>
      <div className="grid gap-6">

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="john@example.com" required className="text-primary text-semibold text-md" />
        </div>

          <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="john doe" required className="text-primary text-semibold text-md" />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} id="name" type="password"  className="text-primary text-semibold text-md" />
        </div>

         {showOtpInput && <div className="grid gap-3">
         <Label htmlFor="otp">Otp</Label>

         <InputOTP maxLength={6} aria-label="OTP" className="w-full" value={otp} onChange={(value) => setOtp(value)}>

        <InputOTPGroup>
            <InputOTPSlot index={0}/>
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
        
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
        </InputOTPGroup>
        </InputOTP>

        <Button disabled={loading} onClick={checkOtp} className="w-full btn-primary hover:cursor-pointer">
          checkOtp & signup
        </Button> 
       </div>
       }

       {!showOtpInput &&  <Button type="submit" className="w-full btn-primary">
         Signup
        </Button> }
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
       
       
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign In
        </a>
      </div>
    </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/Login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

