"use client";

import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import Link from "next/link";

const CartPage = () => {
    const { cartItems, removeFromCart, loading } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => {
        return sum + (Number(item.basePrice) || 0);
    }, 0);

    if (loading) {
        return (
            <div className="container mx-auto p-10 text-center">
                <p className="text-xl text-gray-500">Загрузка вашей корзины...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 min-h-[60vh]">
            <h1 className="text-3xl font-bold text-[#414141] mb-8">Корзина</h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                    <img
                        src="/icons-header/cart.svg"
                        alt="Пусто"
                        className="w-20 h-20 opacity-20 mb-4"
                    />
                    <p className="text-xl text-[#414141] mb-6">В корзине пока пусто</p>
                    <Link
                        href="/"
                        className="bg-[#70c05b] text-white px-8 py-3 rounded-lg hover:bg-[#5fa54d] transition-colors"
                    >
                        Перейти к покупкам
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 gap-4"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center">
                                        <img
                                            src={item.img}
                                            alt={item.description}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-medium text-[#414141] line-clamp-2">
                                            {item.description}
                                        </h2>
                                        <p className="text-[#ff6633] font-bold mt-1">
                                            {formatPrice(item.basePrice)} ₽
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors p-2"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-[#414141] mb-6">Итого</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[#414141]">
                                    <span>Количество товаров:</span>
                                    <span className="font-bold">{cartItems.length}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-[#414141] pt-4 border-t border-gray-100">
                                    <span>К оплате:</span>
                                    <span className="text-[#ff6633]">{formatPrice(totalPrice)} ₽</span>
                                </div>
                            </div>

                            <button className="w-full bg-[#70c05b] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#5fa54d] active:scale-[0.98] transition-all">
                                Оформить заказ
                            </button>

                            <p className="text-[10px] text-gray-400 mt-4 text-center">
                                Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CartPage;