"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

const TopMenu = () => {
    const { cartItems } = useCart();

    return (
        <ul className="flex flex-row gap-x-6 items-end">
            <li className="flex flex-col items-center gap-2.5 md:hidden w-11 cursor-pointer">
                <img
                    src="/icons-header/basket.svg"
                    alt="Меню"
                    width={24}
                    height={24}
                    className="object-contain w-6 h-6"
                />
                <span>Каталог</span>
            </li>
            <Link href="/favorites">


            <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
                <img
                    src="/icons-header/favorites.svg"
                    alt="Избранное"
                    width={24}
                    height={24}
                    className="object-contain w-6 h-6"
                />
                <span>Избранное</span>
            </li>
            </Link>

            <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
                <img
                    src="/icons-header/deliver.svg"
                    alt="Заказы"
                    width={24}
                    height={24}
                    className="object-contain w-6 h-6"
                />
                <span>Заказы</span>
            </li>

            <Link href="/cart">
                <li className="relative flex flex-col items-center gap-2.5 w-11 cursor-pointer group">

                    {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#ff6633] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                            {cartItems.length}
                        </span>
                    )}

                    <img
                        src="/icons-header/cart.svg"
                        alt="Корзина"
                        width={24}
                        height={24}
                        className="object-contain w-6 h-6 group-hover:opacity-80 transition-opacity"
                    />
                    <span >Корзина</span>
                </li>
            </Link>
        </ul>
    );
}

export default TopMenu;