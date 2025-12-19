"use client";

import { useState, useEffect } from "react";
import { ProductCardProps } from "@/app/types/product";
import { formatPrice } from "@/app/utils/formatPrice";
import StarRating from "@/app/components/StarRating";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

const cardDiscountPercent = 6;

const ProductCard = (product: ProductCardProps) => {
    const {
        _id,
        img,
        description,
        basePrice,
        discountPercent = 0,
        rating,
        categories
    } = product;

    const { addToCart, cartItems } = useCart();

    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

    const isInCart = cartItems.some(item => String(item._id) === String(_id));

    useEffect(() => {
        const checkFavorite = async () => {
            if (!_id) return;
            try {
                const res = await fetch('/api/favorites');
                if (res.ok) {
                    const data = await res.json();
                    const items = data.items || [];
                    setIsFavorite(items.some((item: any) => String(item._id) === String(_id)));
                }
            } catch (error) {
                console.error("Ошибка избранного:", error);
            }
        };
        checkFavorite();
    }, [_id]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (favLoading || !_id) return;

        setFavLoading(true);
        try {
            if (isFavorite) {
                const res = await fetch('/api/favorites', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: _id })
                });
                if (res.ok) setIsFavorite(false);
            } else {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product })
                });
                if (res.ok) setIsFavorite(true);
            }
        } catch (error) {
            console.error("Ошибка при переключении избранного:", error);
        } finally {
            setFavLoading(false);
        }
    };

    const calculateFinalPrice = (price: number, discount: number): number => {
        return discount > 0 ? price * (1 - discount / 100) : price;
    }
    const isNewProbuct = categories?.includes("new");
    const finalPrice = isNewProbuct ? basePrice : calculateFinalPrice(basePrice, discountPercent);
    const priceByCard = isNewProbuct ? basePrice : finalPrice * (1 - cardDiscountPercent / 100);
    const ratingValue = rating?.rate || 5;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isInCart) {
            addToCart(product);
        }
    };

    return (
        <div className="flex flex-col w-[271px] h-[430px] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg duration-300 border border-gray-100">
            {/* Верхняя часть: Картинка */}
            <div className="relative w-full h-[180px] bg-gray-50 flex-shrink-0 flex items-center justify-center">
                <Link href={`/product/${_id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                    <img
                        src={img}
                        alt={description}
                        className="max-w-full max-h-full object-contain p-2"
                    />
                </Link>

                <button
                    onClick={toggleFavorite}
                    disabled={favLoading}
                    className={`z-10 w-8 h-8 p-1.5 absolute top-2 right-2 rounded-full cursor-pointer duration-300 flex items-center justify-center shadow-sm transition-colors ${
                        isFavorite ? "bg-[#ff6633]" : "bg-white/90 hover:bg-[#fcd5ba]"
                    }`}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "white" : "none"}
                        stroke={isFavorite ? "white" : "#414141"}
                        strokeWidth="2"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                </button>

                {discountPercent > 0 && (
                    <div className="absolute bg-[#ff6633] py-1 px-3 rounded text-white text-sm font-medium bottom-2 left-2">
                        -{discountPercent}%
                    </div>
                )}
            </div>

            <div className="flex flex-col p-4 gap-2 flex-1 pb-4 overflow-hidden">
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-[#414141]">{formatPrice(priceByCard)} ₽</span>
                        <span className="text-[12px] text-[#666] ml-1">по карте</span>
                    </div>
                    {discountPercent > 0 && (
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm line-through text-[#999]">{formatPrice(finalPrice)} ₽</span>
                            <p className="text-[12px] text-[#999] ml-1">обычная</p>
                        </div>
                    )}
                </div>

                <Link href={`/product/${_id}`} className="cursor-pointer hover:text-[#70c05b] transition-colors">
                    <div className="text-[15px] text-[#414141] font-medium leading-snug line-clamp-2 min-h-[40px]">
                        {description}
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <StarRating rating={ratingValue} />
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`w-full h-10 mt-auto rounded-lg text-base font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center border ${
                        isInCart 
                        ? "bg-[#70c05b] text-white border-[#70c05b] cursor-default opacity-90" 
                        : "border-[#70c05b] bg-transparent text-[#70c05b] hover:bg-[#f63] hover:text-white hover:border-[#f63]"
                    }`}
                >
                    {isInCart ? "В корзине" : "В корзину"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;