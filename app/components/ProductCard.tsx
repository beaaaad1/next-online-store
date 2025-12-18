"use client";

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

    const isInCart = cartItems.some(item => String(item._id) === String(_id));

    const calculateFinalPrice = (price: number, discount: number): number => {
        return discount > 0 ? price * (1 - discount / 100) : price;
    }

    const calculatePriceByCard = (price: number, discount: number): number => {
        return calculateFinalPrice(price, discount);
    }

    const isNewProbuct = categories?.includes("new");
    const finalPrice = isNewProbuct ? basePrice : calculateFinalPrice(basePrice, discountPercent);
    const priceByCard = isNewProbuct ? basePrice : calculatePriceByCard(finalPrice, cardDiscountPercent);
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

            <Link href={`/product/${_id}`} className="relative w-full h-[180px] bg-gray-50 flex items-center justify-center cursor-pointer">
                <img
                    src={img}
                    alt={description}
                    className="max-w-full max-h-full object-contain p-2"
                />

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="z-10 w-8 h-8 p-1.5 bg-white/90 hover:bg-[#fcd5ba] absolute top-2 right-2 rounded-full cursor-pointer duration-300 flex items-center justify-center shadow-sm"
                >
                    <img
                        src="/icons-header/favorites.svg"
                        alt="В избранное"
                        width={20}
                        height={20}
                    />
                </button>

                {discountPercent > 0 && (
                    <div className="absolute bg-[#ff6633] py-1 px-3 rounded text-white text-sm font-medium bottom-2 left-2">
                        -{discountPercent}%
                    </div>
                )}
            </Link>

            <div className="flex flex-col p-4 gap-3 flex-1">
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-[#ff6633]">{formatPrice(priceByCard)} ₽</span>
                        {discountPercent > 0 && (
                            <span className="text-[14px] text-[#666] ml-1">по карте</span>
                        )}
                    </div>
                    {finalPrice !== basePrice && cardDiscountPercent > 0 && (
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm line-through text-[#999]">{formatPrice(finalPrice)} ₽</span>
                            <p className="text-[14px] text-[#999] ml-1 text-right">обычная</p>
                        </div>
                    )}
                </div>

                <Link href={`/product/${_id}`} className="cursor-pointer hover:text-[#70c05b] transition-colors">
                    <div className="text-[15px] text-[#414141] font-medium leading-snug line-clamp-2 flex-1">
                        {description}
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="flex text-amber-500 text-lg">
                        {ratingValue > 0 && <StarRating rating={ratingValue} />}
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`w-full h-10 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center border ${
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