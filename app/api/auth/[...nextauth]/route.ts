import NextAuth from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import prismaClient from "@/app/config/prisma";
import { compare } from "bcrypt";

const handler = NextAuth({
   
    providers: [
         CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'},
                otp: {label: 'otp', type: 'text'}
            },
            async authorize(credentials) {
                
              if(!credentials?.email || !credentials?.password || !credentials?.otp){
                return null;
              }

              const user = await prismaClient.user.findUnique({
                where : {
                    email: credentials.email,
                } 
              })

              if(!user){
                return null;
              }

              const isValidPass = await compare(credentials.password, user?.password)
              if(!isValidPass){
                return null;
              }

              if(user.code !== credentials.otp) {
               return null;
              }
              
              return {
                id: user.id,
                email: user.email,
                name: user.name,
              };
            },          
         })
    ],
   callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if(token){
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
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