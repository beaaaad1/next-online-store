"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ProductCardProps } from '@/app/types/product';

interface CartContextType {
    cartItems: ProductCardProps[];
    addToCart: (product: ProductCardProps) => Promise<void>;
    removeFromCart: (id: string | number) => Promise<void>;
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
                const res = await fetch('/api/cart');
                const data = await res.json();
                setCartItems(data.items || []);
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
};;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};