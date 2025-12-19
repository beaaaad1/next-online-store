import { NextResponse } from 'next/server';
import { getDB } from "@/api-routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {ObjectId} from "mongodb";

interface FavoriteItem {
    id: number | string;
    [key: string]: unknown;
}

interface FavoriteDocument {
    _id?: ObjectId;
    userId: string;
    items: FavoriteItem[];
    updatedAt: Date;
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ items: [] });

    const db = await getDB();
    const favorites = await db.collection('favorites').findOne({ userId: session.user.id });
    return NextResponse.json(favorites || { items: [] });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { product } = await req.json();
    const db = await getDB();

    // Добавляем товар в массив, если его там нет
    await db.collection('favorites').updateOne(
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
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    const db = await getDB();

    await db.collection<FavoriteDocument>('favorites').updateOne(
        { userId: session.user.id },
        {
            $pull: {
                items: { id: productId }
            }
        }
    );

    return NextResponse.json({ success: true });
}