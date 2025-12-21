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
            async authorize(credentials) {

                if (credentials?.email === "admin@store.com" && credentials?.password === "admin") {
                    return {
                        id: "admin-id",
                        name: "Главный Админ",
                        email: "admin@store.com",
                        role: "admin",
                    };
                }

                await dbConnect();
                const userFromDb = await User.findOne({ email: credentials?.email }).select('+password');

                if (!userFromDb) {
                    throw new Error("Неверный email или пароль.");
                }

                const isMatch = await bcrypt.compare(credentials?.password as string, userFromDb.password);

                if (!isMatch) {
                    throw new Error("Неверный email или пароль.");
                }

                return {
                    id: userFromDb._id.toString(),
                    name: userFromDb.name,
                    email: userFromDb.email,
                    role: "user", // Обычный пользователь из базы
                };
            }
        })
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 дней
    },

    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };