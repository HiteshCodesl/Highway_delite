import prismaClient from "@/app/config/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));


  await prismaClient.user.update({
    where: {
       email: email
    },
    data: {
       code : otp
    }
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}.`,
  });

  return NextResponse.json({ message: "OTP sent successfully" });
}
