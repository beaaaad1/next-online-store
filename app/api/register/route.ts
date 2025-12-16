// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { name, email, password } = await req.json();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { message: "Пользователь с таким email уже существует." },
                { status: 409 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const userObject = newUser.toObject();
        delete userObject.password;

        return NextResponse.json(
            { message: "Регистрация прошла успешно", user: userObject },
            { status: 201 }
        );

    } catch (error) {
        console.error("Ошибка регистрации:", error);
        return NextResponse.json(
            { message: "Ошибка сервера при регистрации." },
            { status: 500 }
        );
    }
}