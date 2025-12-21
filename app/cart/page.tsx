"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const PICKUP_POINTS = [
    { id: 1, address: "г. Оренбург, ул. Чкалова, 7", mapUrl: "https://yandex.ru/map-widget/v1/?ll=55.122902%2C51.765561&mode=whatshere&whatshere%5Bpoint%5D=55.123109%2C51.765591&whatshere%5Bzoom%5D=17&z=19.37" },
];

const CartPage = () => {
    const { cartItems, removeFromCart, loading, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPoint] = useState(PICKUP_POINTS[0]);
    const router = useRouter();

    const SOFT_DARK = "#BAC6D7";
    const THEME_BLUE = "#125DF2";

    const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.basePrice) || 0), 0);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setIsSubmitting(true);
        const checkoutPromise = fetch("/api/orders", {
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
        }).then(async (res) => {
            if (!res.ok) throw new Error();
            return res;
        });

        toast.promise(checkoutPromise, {
            loading: 'Оформляем ваш заказ...',
            success: () => {
                clearCart();
                router.push("/orders");
                return 'Заказ успешно создан! 🎉';
            },
            error: 'Не удалось оформить заказ ❌',
        }, {
            style: { border: `1px solid ${SOFT_DARK}`, borderRadius: '12px' }
        });

        try { await checkoutPromise; } catch (err) {} finally { setIsSubmitting(false); }
    };

    if (loading) return <div className="container mx-auto p-10 text-center text-slate-500">Загрузка...</div>;

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 border-b pb-4" style={{ borderColor: SOFT_DARK }}>
                Оформление заказа
            </h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border" style={{ borderColor: SOFT_DARK }}>
                    <p className="text-xl text-slate-400 mb-6">В корзине пока пусто</p>
                    <Link href="/" className="text-white px-8 py-3 rounded-xl font-bold bg-slate-700 hover:bg-slate-800 transition-all">
                        На главную
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Товары */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm" style={{ borderColor: SOFT_DARK }}>
                            <h2 className="text-xl font-bold mb-4 text-slate-800">1. Товары в заказе</h2>
                            <div className="divide-y divide-slate-100">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="py-4 flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                            <img src={item.img} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-700 line-clamp-1">{item.description}</p>
                                            <p className="font-bold text-[#ff6633]">{formatPrice(item.basePrice)} ₽</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors px-2"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Способ получения */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm" style={{ borderColor: SOFT_DARK }}>
                            <h2 className="text-xl font-bold mb-4 text-slate-800">2. Способ получения</h2>
                            <div className="mb-6 p-4 border rounded-xl flex justify-between items-center bg-slate-50" style={{ borderColor: SOFT_DARK }}>
                                <div>
                                    <p className="font-bold text-slate-700">Пункт выдачи заказов</p>
                                    <p className="text-sm text-slate-500">{selectedPoint.address}</p>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 bg-slate-200 text-slate-700 rounded-full">ВЫБРАНО</span>
                            </div>

                            <div className="rounded-xl overflow-hidden border h-[400px]" style={{ borderColor: SOFT_DARK }}>
                                <iframe
                                    src={selectedPoint.mapUrl}
                                    width="100%" height="100%" frameBorder="0" allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка: Итог */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl border shadow-lg sticky top-24" style={{ borderColor: SOFT_DARK }}>
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Итого</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Товары ({cartItems.length}):</span>
                                    <span className="text-slate-800">{formatPrice(totalPrice)} ₽</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Доставка:</span>
                                    <span className="text-green-600 font-bold">Бесплатно</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-slate-800 pt-5 border-t border-slate-100">
                                    <span>К оплате:</span>
                                    <span className="text-[#ff6633]">{formatPrice(totalPrice)} ₽</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-md active:scale-[0.97] ${
                                    isSubmitting ? "bg-slate-400" : "hover:shadow-xl opacity-100"
                                }`}
                                style={{ backgroundColor: isSubmitting ? undefined : THEME_BLUE }}
                            >
                                {isSubmitting ? "Обработка..." : "Оформить заказ"}
                            </button>
                            <p className="text-[11px] text-slate-400 text-center mt-4 uppercase font-bold tracking-tighter">
                                Нажимая кнопку, вы подтверждаете заказ
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;