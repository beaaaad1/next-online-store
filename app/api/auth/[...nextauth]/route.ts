// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({

            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Пароль", type: "password" }
            },
            async authorize(credentials, req) {

                await dbConnect();


                const user = await User.findOne({ email: credentials?.email }).select('+password');

                if (!user) {
                    throw new Error("Неверный email или пароль.");
                }


                const isMatch = await bcrypt.compare(credentials?.password as string, user.password);

                if (!isMatch) {
                    throw new Error("Неверный email или пароль.");
                }


                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,

                };
            }
        })
    ],


    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    pages: {

        signIn: '/auth/login',
        error: '/auth/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {

            if (token && session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };