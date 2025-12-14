// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

    interface User extends DefaultUser {
        id: string; // Обязательно добавляем
        name: string;
        email: string;
    }


    interface Session extends DefaultSession {
        user: {
            id: string;
            name: string;
            email: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    /**
     * Токен JWT
     */
    interface JWT {
        id: string;
        name: string;
        email: string;
    }
}