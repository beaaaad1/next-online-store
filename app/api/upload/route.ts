// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@/auth";
import fs from 'fs/promises'; // Для работы с файловой системой Node.js
import path from 'path';

// Директория для сохранения аватаров (внутри папки public)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'avatars');

// Утилита для проверки MIME-типа файла
const isImage = (mimeType: string) => mimeType.startsWith('image/');

export async function POST(req: NextRequest) {
    try {
        // 1. Проверка авторизации
        const session = await getSession();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Необходимо авторизоваться для загрузки файла." }, { status: 401 });
        }

        // 2. Получаем данные формы (App Router использует Request.formData())
        const formData = await req.formData();
        const file = formData.get('avatar') as File | null; // Предполагаем, что файл отправлен под именем 'avatar'

        if (!file || !isImage(file.type)) {
            return NextResponse.json({ message: "Пожалуйста, выберите действительный файл изображения." }, { status: 400 });
        }

        // 3. Создаем уникальное имя файла
        const fileExtension = path.extname(file.name);
        // Безопасное имя: ID пользователя + метка времени
        const safeFileName = `${session.user.id}_${Date.now()}`;
        const uniqueFileName = `${safeFileName}${fileExtension}`;

        const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        const publicPath = `/avatars/${uniqueFileName}`; // Путь, доступный через HTTP

        // 4. Читаем файл в буфер
        const buffer = Buffer.from(await file.arrayBuffer());

        // 5. Убеждаемся, что папка public/avatars существует
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // 6. Сохраняем файл на диск
        await fs.writeFile(filePath, buffer);

        // 7. Возвращаем публичный путь
        return NextResponse.json({
            message: "Файл успешно загружен.",
            imageUrl: publicPath
        }, { status: 200 });

    } catch (error) {
        console.error("Ошибка загрузки файла:", error);
        return NextResponse.json(
            { message: "Ошибка сервера при загрузке файла." },
            { status: 500 }
        );
    }
}