import prismaClient from "@/app/config/prisma";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const {email,password, name} = await request.json();

    try{

    if(!email ||  !name || !password){ return null};

    const checkUser = await prismaClient.user.findUnique({
        where: {
            email: email
        }
    })
    
    if(checkUser) {
        return NextResponse.json({status: 409, json: "user is already exists, try signin"})
    }

    const hashedPassword = await hash(password, 10);
    const user = await prismaClient.user.create({
        data: {
            email: email,
            name: name,
            password: hashedPassword,
        }
    })

    if(!user){
        return NextResponse.json("error while creating a user")
    }

    return NextResponse.json("user Successfully created"); 
    
   }catch(error){
    return console.log(error);
   }
}