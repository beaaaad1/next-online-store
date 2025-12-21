"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ProductCardProps } from '@/app/types/product';

interface CartContextType {
    cartItems: ProductCardProps[];
    addToCart: (product: ProductCardProps) => Promise<void>;
    removeFromCart: (id: string | number) => Promise<void>;
    clearCart: () => Promise<void>; // Добавили новый метод
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState<ProductCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            if (status === "authenticated") {
                try {
                    const res = await fetch('/api/cart');
                    if (res.ok) {
                        const data = await res.json();
                        setCartItems(data.items || []);
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке корзины:", error);
                }
            } else {
                setCartItems([]);
            }
            setLoading(false);
        };
        fetchCart();
    }, [session, status]);

    const addToCart = async (product: ProductCardProps) => {
        if (status !== "authenticated") {
            alert("Пожалуйста, войдите в систему");
            return;
        }

        setCartItems(prev => [...prev, product]);

        await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product }),
        });
    };

    const removeFromCart = async (productId: string | number) => {
        setCartItems(prev => prev.filter(item => String(item._id) !== String(productId)));

        await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: String(productId) }),
        });
    };

    // НОВАЯ ФУНКЦИЯ: Очистка корзины после заказа
    const clearCart = async () => {
        // 1. Очищаем локальное состояние
        setCartItems([]);

        // 2. Отправляем запрос на сервер для очистки коллекции в БД
        // Мы используем метод DELETE, передавая специальный флаг или просто пустой запрос,
        // если ваш API умеет удалять всё.
        // Обычно проще всего реализовать DELETE без параметров как "удалить всё у этого пользователя"
        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clearAll: true }), // Добавляем флаг очистки всего
            });
        } catch (error) {
            console.error("Ошибка при очистке корзины:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};