
import { NextResponse } from "next/server";
import { getSession } from "@/auth";
import dbConnect from "@/mongodb";
import Order from "@/app/models/Order";

export async function GET() {
    try {
        const session = await getSession();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Необходимо авторизоваться." }, { status: 401 });
        }

        await dbConnect();

        const userId = session.user.id;

        const orders = await Order.find({ userId: userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return NextResponse.json(
            { message: "Ошибка сервера при получении заказов." },
            { status: 500 }
        );
    }
}
