import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/auth";
import dbConnect from "@/mongodb";
import User from "@/app/models/User";
import { Types } from "mongoose";

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const session = await getSession();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Необходимо авторизоваться." }, { status: 401 });
        }

        const userId = session.user.id as string;
        const { name, image } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Имя обязательно для заполнения." }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            new Types.ObjectId(userId),
            { name, image },
            { new: true, runValidators: true, select: '-password' }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "Пользователь не найден." }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Профиль успешно обновлен", user: updatedUser },
            { status: 200 }
        );

    } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
        return NextResponse.json(
            { message: "Ошибка сервера при обновлении профиля." },
            { status: 500 }
        );
    }
}