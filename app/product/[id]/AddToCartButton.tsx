"use client";

import { useCart } from "@/app/context/CartContext";
import { ProductCardProps } from "@/app/types/product";

export default function AddToCartButton({ product }: { product: ProductCardProps }) {
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some(item =>
    String(item.id) === String(product.id) ||
    String(item._id) === String(product._id)
  );

  return (
    <button
      onClick={() => !isInCart && addToCart(product)}
      disabled={isInCart}
      className={`w-full md:w-64 h-12 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
        isInCart 
        ? "bg-gray-100 text-gray-500 cursor-default" 
        : "bg-[#70c05b] text-white hover:bg-[#ff6633] active:scale-95"
      }`}
    >
      <img
        src="/icons-header/cart.svg"
        alt=""
        className={`w-5 h-5 ${isInCart ? 'grayscale' : 'brightness-0 invert'}`}
      />
      {isInCart ? "Уже в корзине" : "В корзину"}
    </button>
  );
}