// components/ProfileDropdown.tsx
"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link'; // Используем Link для навигации

const ProfileDropdown = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false); // Состояние для управления видимостью меню

    const toggleDropdown = () => setIsOpen(!isOpen);

    // 1. Состояние "Загрузка"
    if (status === 'loading') {
        return <div className="ml-6 p-2">Загрузка...</div>;
    }

    // 2. Состояние "Неавторизован"
    if (status === 'unauthenticated' || !session?.user) {
        return (
             <div className="ml-6 flex items-center space-x-2">
                 <Link href="/auth/login" className="text-sm hover:underline p-2">Вход</Link>
                 <span>/</span>
                 <Link href="/auth/register" className="text-sm hover:underline p-2">Регистрация</Link>
             </div>
        );
    }

    // 3. Состояние "Авторизован"
    const userName = session.user.name || session.user.email?.split('@')[0];
    const userEmail = session.user.email;

    return(
        <div className="ml-6 p-2 relative">
            {/* Клик на аватаре / имени открывает меню */}
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={toggleDropdown}
            >
                {/* Аватар */}
                <img
                    src="/images/avatar.jpg" // Замените на динамический путь, если есть
                    alt={userName}
                    width={40} height={40}
                    className="min-w-10 min-h-10 rounded-full border-2 border-transparent hover:border-blue-500 transition-all"
                />

                {/* Имя */}
                <p className="hidden xl:block p-2.5 font-medium">{userName}</p>

                {/* Стрелка */}
                <img
                    src="/icons-header/arrow.svg"
                    alt="arrow" width={24} height={24}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Выпадающее меню (Dropdown) */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b">
                        <p className="font-bold">{userName}</p>
                        <p className="text-sm text-gray-500">{userEmail}</p>
                    </div>

                    {/* Ссылки навигации */}
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Личный кабинет
                    </Link>
                    <Link href="/orders" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Мои заказы
                    </Link>

                    {/* Кнопка выхода */}
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg border-t"
                    >
                        Выйти из аккаунта
                    </button>
                </div>
            )}
        </div>
    );
};
export default ProfileDropdown;