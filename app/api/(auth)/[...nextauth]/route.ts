import NextAuth from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import {compare} from "bcrypt";
import prismaClient from "@/app/config/prisma";

const handler = NextAuth({
   
    providers: [
         CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: 'email', type: 'text', placeholder: 'enter your email'},
            },
            async authorize(credentials) {
                
              if(!credentials?.email) {
                return null;
              };

              const user = await prismaClient.user.findUnique({
                where : {
                    email: credentials.email
                }
              })
              if(!user) return null;

              return{
                 id: user.id,
                 email: user.email,
                 name: user.name
              }
            },
         })
    ],
   callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.email = (user as any).email
        token.name = (user as any).name;
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
     pages: {
        signIn: '/login'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };