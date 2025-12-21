import { NextResponse } from 'next/server';
import { getDB } from "@/api-routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ items: [] });
    }

    const db = await getDB();
    const cart = await db.collection('carts').findOne({ userId: session.user.id });

    return NextResponse.json(cart || { items: [] });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product } = await req.json();
    const db = await getDB();

    await db.collection('carts').updateOne(
        { userId: session.user.id },
        {
            $addToSet: { items: product },
            $set: { updatedAt: new Date() }
        },
        { upsert: true }
    );

    return NextResponse.json({ success: true });
}


export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, clearAll } = await req.json();
    const db = await getDB();

    // Описываем структуру документа для корректной работы $pull
    // Внутри функции DELETE
    interface CartDoc {
        userId: string;
        items: { _id: string | number }[]; // Указываем возможные типы ID
        updatedAt?: Date;
    }

    const collection = db.collection<CartDoc>('carts');

    // 1. Логика полной очистки
    if (clearAll) {
        await collection.updateOne(
            { userId: session.user.id },
            { $set: { items: [], updatedAt: new Date() } }
        );
        return NextResponse.json({ success: true, message: "Cart cleared" });
    }

    // 2. Логика удаления одного товара
    if (productId) {
        await collection.updateOne(
            { userId: session.user.id },
            // Используем cast через any, если типизация всё равно конфликтует,
            // но в данном случае явное указание CartDoc должно помочь.
            { $pull: { items: { _id: productId } } as unknown as any }
        );
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No action provided" }, { status: 400 });
}