"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Header() {
  const {data: session} = useSession();
  const router = useRouter();

   return (
    <div className="flex justify-between ">
    <div className="flex gap-3 items-center">
        <Image
          src='/logo.png'
          alt='Logo'
          width={50}          
          height={50}  
          className="size-8" 
        />
        <p className="text-xl font-bold">Dashboard</p>
    </div>
    {session ? <div onClick={() => signOut()} className="text-lg font-medium underline">
       signout
    </div> : <div onClick={() => router.push('/login')} className="text-lg font-medium underline">
       signin
    </div> }
    </div>
  )
}

