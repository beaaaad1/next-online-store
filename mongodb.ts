// lib/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

// Собираем полную строку подключения
const MONGO_URI = `${process.env.NEXT_ONLINE_STORE_DB_URL!}${process.env.NEXT_ONLINE_STORE_DB_NAME!}`;

if (!MONGO_URI) {
    throw new Error(
        "Please define the NEXT_ONLINE_STORE_DB_URL and NEXT_ONLINE_STORE_DB_NAME environment variables inside .env"
    );
}


// Используем 'global' в Node.js среде Next.js (Серверный код)
let cached = global.mongoose;

if (!cached) {
    // Инициализируем кэш, используя объявленный глобальный тип
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached!.promise = mongoose
            .connect(MONGO_URI, opts)
            .then((mongoose) => {
                return mongoose;
            });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;
        throw e;
    }

    return cached!.conn;
}

export default dbConnect;