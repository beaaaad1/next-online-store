import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Возвращаемый объект при успешном authorize
     */
    interface User extends DefaultUser {
        id: string;
        name: string;
        email: string;
    }

    /**
     * Объект сессии
     */
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