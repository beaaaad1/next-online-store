// app/profile/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div className="p-8 text-center">Загрузка...</div>;
    }

    // Если Middleware не сработало или сессия пуста (хотя это маловероятно при правильном middleware)
    if (status === "unauthenticated") {
        router.replace('/auth/login');
        return null;
    }

    const user = session!.user!;

    return (
        <div className="px-[max(12px,calc((100%-1208px)/2))] py-20 min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-8 border-b pb-4">Личный Кабинет</h1>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Левая колонка: Аватар и Выход */}
                <div className="w-full md:w-1/4 flex flex-col items-center">
                    <img
                        src="/images/avatar.jpg" // Замените на динамический путь
                        alt={user.name || "Аватар"}
                        width={120} height={120}
                        className="rounded-full shadow-lg mb-4"
                    />
                    <p className="text-xl font-semibold mb-2">{user.name}</p>

                    {/* Кнопка выхода */}
                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })} // Перенаправляем на логин после выхода
                        className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors w-full max-w-xs"
                    >
                        Выйти из аккаунта
                    </button>
                </div>

                {/* Правая колонка: Основные данные */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-semibold mb-4">Мои данные</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md border">

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500">Имя</label>
                            <p className="text-lg">{user.name}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500">Email (Логин)</label>
                            <p className="text-lg">{user.email}</p>
                        </div>

                        {/* Здесь можно добавить другие данные, как только они появятся в модели User */}
                        {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500">Адрес доставки</label>
                            <p className="text-lg">ул. Пушкина, 5</p>
                        </div> */}

                        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                            Редактировать профиль
                        </button>
                    </div>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">История Заказов</h2>
                    {/* Здесь будет компонент для отображения заказов */}
                    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                        <p className="text-gray-600">Пока заказов нет. Самое время начать покупки!</p>
                    </div>
                </div>
            </div>

        </div>
    );
}