"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ProductCardProps } from '@/app/types/product';
import toast from 'react-hot-toast';

interface CartContextType {
    cartItems: ProductCardProps[];
    addToCart: (product: ProductCardProps) => Promise<void>;
    removeFromCart: (id: string | number) => Promise<void>;
    clearCart: () => Promise<void>;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState<ProductCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    const THEME_BLUE = "#125DF2";

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
            toast.error("Войдите в систему, чтобы добавить товар", {
                style: {
                    border: `2px solid ${THEME_BLUE}`,
                    borderRadius: '12px',
                    fontWeight: '600'
                },
            });
            return;
        }

        setCartItems(prev => [...prev, product]);

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product }),
            });

            if (res.ok) {
                toast.success(`${product.title || 'Товар'} добавлен в корзину`, {
                    icon: '🛒',
                    style: {
                        border: `2px solid #70c05b`,
                        borderRadius: '12px',
                        fontWeight: '600'
                    },
                });
            }
        } catch (error) {
            toast.error("Не удалось сохранить в корзине");
            console.error(error);
        }
    };

    const removeFromCart = async (productId: string | number) => {
        const itemToRemove = cartItems.find(item => String(item._id) === String(productId));

        setCartItems(prev => prev.filter(item => String(item._id) !== String(productId)));

        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: String(productId) }),
            });

            toast("Товар удален из корзины", {
                icon: '🗑️',
                style: { borderRadius: '12px' }
            });
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clearAll: true }),
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