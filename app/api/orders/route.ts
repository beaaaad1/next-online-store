import { NextResponse } from 'next/server';
import { getDB } from "@/api-routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { items, totalPrice, customerData } = await req.json();
        const db = await getDB();

        const newOrder = {
            userId: session.user.id,
            items,
            totalPrice,
            deliveryPoint: customerData.deliveryPoint,
            status: "В обработке",
            createdAt: new Date(),
        };

        const result = await db.collection('orders').insertOne(newOrder);
        return NextResponse.json({ success: true, orderId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDB();
    const orders = await db.collection('orders')
        .find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .toArray();

    return NextResponse.json(orders);
}