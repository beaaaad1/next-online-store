import Image from "next/image";
const TopMenu = () => {
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
          <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
            <img
              src="/icons-header/cart.svg"
              alt="Корзина"
              width={24}
              height={24}
              className="object-contain w-6 h-6"
            />
            <span>Корзина</span>
          </li>
        </ul>
    );
}
export default TopMenu;