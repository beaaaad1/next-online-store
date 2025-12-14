"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const ProfileDropdown = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    if (status === 'loading') {
        return <div className="ml-6 p-2">Загрузка...</div>;
    }

    if (status === 'unauthenticated' || !session?.user) {
        return (
             <div className="ml-6 flex items-center space-x-2">
                 <Link href="/auth/login" className="text-sm hover:underline p-2">Вход</Link>
                 <span>/</span>
                 <Link href="/auth/register" className="text-sm hover:underline p-2">Регистрация</Link>
             </div>
        );
    }

    const userName = session.user.name || session.user.email?.split('@')[0];
    const userEmail = session.user.email;

    return(
        <div className="ml-6 p-2 relative">
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={toggleDropdown}
            >
                <img
                    src="/images/avatar.jpg"
                    alt={userName}
                    width={40} height={40}
                    className="min-w-10 min-h-10 rounded-full border-2 border-transparent hover:border-blue-500 transition-all"
                />

                <p className="hidden xl:block p-2.5 font-medium">{userName}</p>

                <img
                    src="/icons-header/arrow.svg"
                    alt="arrow" width={24} height={24}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b">
                        <p className="font-bold">{userName}</p>
                        <p className="text-sm text-gray-500">{userEmail}</p>
                    </div>

                    <Link href="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Личный кабинет
                    </Link>
                    <Link href="/orders" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Мои заказы
                    </Link>

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