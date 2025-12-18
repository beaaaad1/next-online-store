// app/api/cart/route.ts

import { NextResponse } from 'next/server';
import { getDB } from "@/api-routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. ПОЛУЧЕНИЕ КОРЗИНЫ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
export async function GET() {
    const session = await getServerSession(authOptions);

    // Если пользователь не авторизован, у него нет "лички", отдаем пусто
    if (!session || !session.user) {
        return NextResponse.json({ items: [] });
    }

    const db = await getDB();

    // Ищем документ в коллекции 'carts', где userId совпадает с ID из сессии
    const cart = await db.collection('carts').findOne({ userId: session.user.id });

    return NextResponse.json(cart || { items: [] });
}

// 2. ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ ПОЛЬЗОВАТЕЛЯ
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product } = await req.json();
    const db = await getDB();

    // Обновляем (или создаем) запись для конкретного userId
    await db.collection('carts').updateOne(
        { userId: session.user.id },
        {
            // $addToSet добавит товар в массив, только если его там еще нет (чтобы не было дублей)
            $addToSet: { items: product },
            $set: { updatedAt: new Date() }
        },
        { upsert: true } // Создать документ, если его еще не существует
    );

    return NextResponse.json({ success: true });
}

// 3. УДАЛЕНИЕ ТОВАРА
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    const db = await getDB();

    await db.collection<never>('carts').updateOne(
        { userId: session.user.id },
        { $pull: { items: { _id: productId } } } // Удаляем объект из массива по его _id
    );

    return NextResponse.json({ success: true });
}