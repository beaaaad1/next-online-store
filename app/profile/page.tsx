"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/app/utils/formatPrice";
import Link from "next/link";

// Типизация для заказов
interface Order {
    _id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const BORDER_BLUE = "#125DF2";

    useEffect(() => {
        if (status === "authenticated") {
            fetch('/api/orders')
                .then(res => res.json())
                .then(data => {
                    // Берем последние 3-5 заказов для превью в профиле
                    setOrders(data);
                    setLoadingOrders(false);
                })
                .catch(() => setLoadingOrders(false));
        }
    }, [status]);

    if (status === "loading") {
        return <div className="p-8 text-center">Загрузка...</div>;
    }

    if (status === "unauthenticated") {
        router.replace('/auth/login');
        return null;
    }

    const user = session!.user!;

    // Функция для цвета статуса
    const getStatusColor = (status: string) => {
        if (status === "В обработке") return "text-purple-600 bg-purple-50";
        if (status === "Доставлен") return "text-green-600 bg-green-50";
        return "text-blue-600 bg-blue-50";
    };

    return (
        <div className="px-[max(12px,calc((100%-1208px)/2))] py-20 min-h-[60vh]">
            <h1
                className="text-3xl font-bold mb-8 border-b-2 pb-4"
                style={{borderColor: '#125DF2'}}
            >
                Личный Кабинет
            </h1>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Левая колонка - Аватар */}
                <div className="w-full md:w-1/4 flex flex-col items-center">
                    <img
                        src="/images/avatar.jpg"
                        alt={user.name || "Аватар"}
                        width={120} height={120}
                        className="rounded-full shadow-lg mb-4 border-2"
                        style={{ borderColor: BORDER_BLUE }}
                    />
                    <p className="text-xl font-semibold mb-2">{user.name}</p>

                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors w-full max-w-xs font-medium"
                    >
                        Выйти из аккаунта
                    </button>
                </div>

                {/* Правая колонка - Данные и Заказы */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-semibold mb-4">Мои данные</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border-2" style={{ borderColor: BORDER_BLUE }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500">Имя</label>
                            <p className="text-lg font-medium">{user.name}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500">Email (Логин)</label>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>

                        <button className="mt-4 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all" style={{ backgroundColor: BORDER_BLUE }}>
                            Редактировать профиль
                        </button>
                    </div>

                    <div className="flex justify-between items-end mt-10 mb-4">
                        <h2 className="text-2xl font-semibold">Последние заказы</h2>
                        {orders.length > 0 && (
                            <Link href="/orders" className="text-sm font-bold underline" style={{ color: BORDER_BLUE }}>
                                Посмотреть все
                            </Link>
                        )}
                    </div>

                    {loadingOrders ? (
                        <div className="p-6 text-center text-gray-400">Загрузка истории...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-10 bg-gray-50 rounded-xl shadow-inner text-center border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">Пока заказов нет. Самое время начать покупки!</p>
                            <Link href="/" className="inline-block font-bold" style={{ color: BORDER_BLUE }}>
                                Перейти в каталог →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.slice(0, 3).map((order) => (
                                <div
                                    key={order._id}
                                    className="flex flex-wrap items-center justify-between p-5 bg-white rounded-xl border-2 shadow-sm transition-all hover:shadow-md"
                                    style={{ borderColor: BORDER_BLUE }}
                                >
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            №{order._id.slice(-6).toUpperCase()}
                                        </p>
                                        <p className="text-sm font-bold text-[#414141]">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Сумма</p>
                                        <p className="font-bold text-[#ff6633]">{formatPrice(order.totalPrice)} ₽</p>
                                    </div>

                                    <Link
                                        href="/orders"
                                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BORDER_BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}