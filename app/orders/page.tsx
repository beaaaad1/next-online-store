"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IOrder } from "@/app/models/Order";

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {

            router.replace('/auth/login');
            return;
        }

        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка при загрузке заказов.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === "loading") {
        return <div className="p-8 text-center min-h-[60vh]">Загрузка заказов...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500 min-h-[60vh]">Ошибка: {error}</div>;
    }

    return (
        <div className="px-[max(12px,calc((100%-1208px)/2))] py-20 min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-8 border-b pb-4">Мои Заказы ({orders.length})</h1>

            {orders.length === 0 ? (
                <div className="p-6 bg-gray-100 text-center rounded-lg shadow-inner">
                    <p className="text-lg text-gray-700 mb-2">У вас пока нет оформленных заказов.</p>
                    <p className="text-gray-500">Начните покупки с главной страницы!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id.toString()} className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                            <div className="flex justify-between items-start mb-4 border-b pb-3">
                                <div>
                                    <p className="text-sm text-gray-500">Заказ №</p>
                                    <p className="font-bold text-xl">{order._id.toString().slice(-8)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Статус</p>
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Список товаров */}
                            <h3 className="font-semibold mb-2">Товары в заказе:</h3>
                            <ul className="space-y-3">
                                {order.items.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center border-b last:border-b-0 py-2">
                                        <div className="flex items-center space-x-4">
                                            {/* Изображение товара (если добавите в OrderItem) */}
                                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                            <p className="font-medium">{item.name}</p>
                                        </div>
                                        <p className="text-gray-600">
                                            {item.quantity} шт. x {item.price.toFixed(2)} ₽
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
                                <p className="text-lg font-bold">Итого:</p>
                                <p className="text-2xl font-bold text-blue-600">{order.totalAmount.toFixed(2)} ₽</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}