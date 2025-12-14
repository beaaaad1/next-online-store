// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// 1. Расширение типа User (для того, что возвращается из CredentialsProvider)
declare module "next-auth" {
    /**
     * Возвращаемый объект при успешном authorize
     */
    interface User extends DefaultUser {
        id: string; // Обязательно добавляем
        name: string;
        email: string;
    }

    /**
     * Объект сессии
     */
    interface Session extends DefaultSession {
        user: {
            id: string; // Добавляем id
            name: string; // Добавляем name
            email: string; // Добавляем email
        } & DefaultSession["user"];
    }
}

// 2. Расширение типа JWT
declare module "next-auth/jwt" {
    /**
     * Токен JWT
     */
    interface JWT {
        id: string; // Добавляем id
        name: string; // Добавляем name
        email: string; // Добавляем email
    }
}