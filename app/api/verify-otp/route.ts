import prismaClient from "@/app/config/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
  }

  const record = await prismaClient.user.findFirst({
    where: { email, code: otp },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "OTP verified successfully" });
}


