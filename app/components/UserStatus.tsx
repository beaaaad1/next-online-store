// components/UserStatus.tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserStatus() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Загрузка...</p>;
    }

    if (session) {
        // Пользователь авторизован
        return (
            <div className="flex items-center space-x-4">
                <span className="text-sm">Привет, {session.user?.name || session.user?.email}!</span>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                    Выход
                </button>
            </div>
        );
    }

    // Пользователь не авторизован
    return (
        <div className="flex space-x-2">
            <a href="/auth/login" className="text-blue-500 hover:underline">Вход</a>
            <span>/</span>
            <a href="/auth/register" className="text-blue-500 hover:underline">Регистрация</a>
        </div>
    );
}