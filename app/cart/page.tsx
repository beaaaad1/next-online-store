"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PICKUP_POINTS = [
    { id: 1, address: "г. Оренбург, ул. Чкалова, 7", mapUrl: "https://yandex.ru/map-widget/v1/?ll=55.122902%2C51.765561&mode=whatshere&whatshere%5Bpoint%5D=55.123109%2C51.765591&whatshere%5Bzoom%5D=17&z=19.37" },
];

const CartPage = () => {
    const { cartItems, removeFromCart, loading, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPoint] = useState(PICKUP_POINTS[0]); // Пока один ПВЗ по умолчанию
    const router = useRouter();

    const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.basePrice) || 0), 0);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems,
                    totalPrice: totalPrice,
                    customerData: {
                        deliveryPoint: selectedPoint.address,
                        orderDate: new Date().toISOString()
                    }
                }),
            });

            if (response.ok) {
                await clearCart();
                router.push("/orders");
            } else {
                alert("Ошибка при оформлении заказа");
            }
        } catch (err) {
            console.error(err);
            alert("Произошла ошибка");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="container mx-auto p-10 text-center text-gray-500">Загрузка корзины...</div>;

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen ">
            <h1 className="text-3xl font-bold text-[#414141] mb-8">Оформление заказа</h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border">
                    <p className="text-xl text-gray-400 mb-6">В корзине пока пусто</p>
                    <Link href="/" className="bg-[#70c05b] text-white px-8 py-3 rounded-lg font-bold transition-all hover:bg-[#5fa54d]">На главную</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Левая колонка: Товары и ПВЗ */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Список товаров */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-[#414141]">1. Товары в заказе</h2>
                            <div className="divide-y">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="py-4 flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#414141] line-clamp-1">{item.description}</p>
                                            <p className="font-bold text-[#ff6633]">{formatPrice(item.basePrice)} ₽</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-500 transition-colors">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Выбор ПВЗ и Карта */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-[#414141]">2. Способ получения</h2>
                            <div className="mb-4 p-4 border-2 border-[#70c05b] bg-[#f0f9ed] rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-[#414141]">Пункт выдачи заказов</p>
                                    <p className="text-sm text-gray-600">{selectedPoint.address}</p>
                                </div>
                                <span className="text-[#70c05b] font-bold">Выбрано</span>
                            </div>

                            <div className="rounded-xl overflow-hidden border border-gray-200 h-[400px]">
                                <iframe
                                    src={selectedPoint.mapUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка: Итог */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-[#414141] mb-6">Итого</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Товары ({cartItems.length}):</span>
                                    <span>{formatPrice(totalPrice)} ₽</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Доставка:</span>
                                    <span className="text-[#70c05b] font-bold">Бесплатно</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-[#414141] pt-4 border-t">
                                    <span>К оплате:</span>
                                    <span className="text-[#ff6633]">{formatPrice(totalPrice)} ₽</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all ${
                                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#70c05b] hover:bg-[#5fa54d] active:scale-[0.98]"
                                }`}
                            >
                                {isSubmitting ? "Оформляем..." : "Оформить заказ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;