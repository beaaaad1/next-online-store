// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
    // Указываем, куда перенаправлять неавторизованного пользователя
    pages: {
        signIn: "/auth/login",

    },
});

// Настройка, какие маршруты должны быть защищены
export const config = {

    matcher: [
        "/profile",      // Защитить страницу профиля
        "/orders",       // Защитить страницу заказов

    ],
};