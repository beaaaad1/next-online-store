"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/app/utils/formatPrice";
import Link from "next/link";

interface OrderItem {
    _id: string;
    description: string;
    img: string;
    basePrice: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    deliveryPoint: string;
    status: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    // Состояние для хранения ID развернутых заказов
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

    const BORDER_BLUE = "#125DF2";

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "В обработке": return "text-purple-600 bg-purple-50 border-purple-100";
            case "Подтвержден": return "text-blue-600 bg-blue-50 border-blue-100";
            case "В пути": return "text-orange-600 bg-orange-50 border-orange-100";
            case "Доставлен": return "text-green-600 bg-green-50 border-green-100";
            case "Возврат": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-gray-500 bg-gray-50";
        }
    };

    if (loading) return <div className="text-center p-20 text-gray-500 font-medium">Загрузка истории...</div>;

    return (
        <main className=" min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-[800px]">
                <h1 className="text-3xl font-bold mb-8 text-[#414141]">Мои заказы</h1>

                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center border-2" style={{ borderColor: BORDER_BLUE }}>
                        <p className="text-gray-400 mb-6 text-lg">Заказов пока нет</p>
                        <Link href="/" className="inline-block px-8 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90" style={{ backgroundColor: BORDER_BLUE }}>
                            К покупкам
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => {
                        const isExpanded = expandedOrders.includes(order._id);

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-sm border-2 mb-8 overflow-hidden transition-all duration-300"
                                style={{ borderColor: BORDER_BLUE }}
                            >
                                {/* Шапка заказа */}
                                <div className="p-6 border-b flex justify-between items-center" style={{ borderBottomColor: BORDER_BLUE }}>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ЗАКАЗ №{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* Список товаров */}
                                <div className="p-6 space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded p-1 border border-gray-100">
                                                    <img src={item.img} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-sm font-medium text-[#414141] line-clamp-1">{item.description}</span>
                                            </div>
                                            <span className="font-bold text-[#414141]">{formatPrice(item.basePrice)} ₽</span>
                                        </div>
                                    ))}

                                    <div className="pt-4 flex justify-between items-end border-t" style={{ borderTopColor: '#f3f4f6' }}>
                                        <span className="text-gray-500 text-sm">Сумма заказа:</span>
                                        <span className="text-2xl font-bold text-[#ff6633]">{formatPrice(order.totalPrice)} ₽</span>
                                    </div>
                                </div>

                                {/* КНОПКА РАЗВЕРТЫВАНИЯ */}
                                <button
                                    onClick={() => toggleOrder(order._id)}
                                    className="w-full p-4 flex items-center justify-between bg-gray-50 border-t-2 hover:bg-gray-100 transition-colors"
                                    style={{ borderTopColor: BORDER_BLUE }}
                                >
                                    <span className="font-bold text-sm text-[#414141]">Информация о ПВЗ</span>
                                    <svg
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                        className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                        style={{ color: BORDER_BLUE }}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {/* СКРЫТЫЙ БЛОК С КАРТОЙ */}
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                    <div className="p-6 bg-white space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white border-2" style={{ borderColor: BORDER_BLUE }}>
                                                    <span className="text-lg">📍</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Адрес</p>
                                                    <p className="text-sm font-semibold text-[#414141]">{order.deliveryPoint || "ул. Чкалова, 7"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white border-2" style={{ borderColor: BORDER_BLUE }}>
                                                    <span className="text-lg">⏰</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">График</p>
                                                    <p className="text-sm font-semibold text-[#414141]">10:00 — 18:00 (Ежедневно)</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl overflow-hidden border-2 h-[250px] bg-white" style={{ borderColor: BORDER_BLUE }}>
                                            <iframe
                                                src="https://yandex.ru/map-widget/v1/?ll=55.122902%2C51.765561&mode=whatshere&whatshere%5Bpoint%5D=55.123109%2C51.765591&whatshere%5Bzoom%5D=17&z=17"
                                                width="100%" height="100%" frameBorder="0"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </main>
    );
}