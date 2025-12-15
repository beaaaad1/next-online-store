// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    // 1. Настройка провайдеров (здесь: CredentialsProvider для логина/пароля)
    providers: [
        CredentialsProvider({
            // Имя, отображаемое на странице входа (если используется встроенный интерфейс)
            name: "Credentials",
            // Поля, которые ожидаются от формы
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Пароль", type: "password" }
            },
            async authorize(credentials, req) {
                // Подключение к БД
                await dbConnect();

                // 1. Поиск пользователя по email
                const user = await User.findOne({ email: credentials?.email }).select('+password');

                if (!user) {
                    throw new Error("Неверный email или пароль.");
                }

                // 2. Сравнение паролей
                // Сравниваем предоставленный пароль с хешем в БД
                const isMatch = await bcrypt.compare(credentials?.password as string, user.password);

                if (!isMatch) {
                    throw new Error("Неверный email или пароль.");
                }


                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    // Добавьте сюда любые другие поля, которые нужны в сессии
                };
            }
        })
    ],

    // 2. Настройка сессии
    session: {
        // Используем JWT для хранения сессии
        strategy: "jwt",
        // Время жизни сессии
        maxAge: 30 * 24 * 60 * 60, // 30 дней
    },

    // 3. Настройка страниц
    pages: {
        // Указываем, куда перенаправлять при необходимости входа
        signIn: '/auth/login',
        // Если у вас будут отдельные страницы регистрации/ошибки
        // newUser: '/auth/register',
        error: '/auth/login',
    },

    // 4. Callbacks для расширения сессии и JWT
    callbacks: {
        async jwt({ token, user }) {
            // Пользовательский объект (user) доступен только при первом входе (signIn)
            if (user) {
                // Благодаря расширению типа, TypeScript теперь знает, что user имеет поля id, name, email
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            // session.user может быть undefined, поэтому нужна проверка
            if (token && session.user) {
                // Добавляем данные из токена в объект сессии
                // Благодаря расширению типа, TypeScript теперь знает, что session.user имеет поля id, name, email
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        }
    },

    // 5. Секретный ключ
    // **ВАЖНО:** Добавьте эту переменную в .env
    secret: process.env.NEXTAUTH_SECRET,
};

// Экспортируем обработчики GET и POST запросов
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };