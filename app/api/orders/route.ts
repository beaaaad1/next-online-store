// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/auth"; // Наша утилита для получения сессии
import dbConnect from "@/mongodb";
import Order from "@/app/models/Order";

export async function GET() {
    try {
        // 1. Получаем сессию
        const session = await getSession();

        // 2. Проверяем авторизацию (NextAuth.js middleware должен уже был это сделать, но это дополнительная защита)
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Необходимо авторизоваться." }, { status: 401 });
        }

        await dbConnect();

        const userId = session.user.id;

        // 3. Находим все заказы, принадлежащие этому пользователю
        const orders = await Order.find({ userId: userId })
            .sort({ createdAt: -1 }) // Сортируем от новых к старым
            .lean(); // Преобразуем Mongoose документы в простые JS объекты

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return NextResponse.json(
            { message: "Ошибка сервера при получении заказов." },
            { status: 500 }
        );
    }
}

// Если вы захотите добавить функционал создания заказа
// export async function POST() { ... }