import Image from "next/image";
import {ProductCardProps} from "@/app/types/product";
import {formatPrice} from "@/app/utils/formatPrice";
import StarRating from "@/app/components/StarRating";

const cardDiscountPercent = 6;

const ProductCard = ({
    img,
    description,
    basePrice,
    discountPercent,
    rating,
    categories
}:
 ProductCardProps) => {



const calculateFinalPrice = (price: number, discount: number): number => {
    return discount > 0 ? price * (1-discount / 100) : price;
}

const calculatePriceByCard = (price: number, discount: number): number => {
    return calculateFinalPrice(price, discount);
}

const isNewProbuct = categories?.includes("new")

const finalPrice = isNewProbuct ? basePrice : calculateFinalPrice(basePrice, discountPercent);

const priceByCard = isNewProbuct ? basePrice : calculatePriceByCard(finalPrice, cardDiscountPercent)



    return (

        <div className="flex flex-col w-[271px] h-[430px] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg duration-300 border border-gray-100">
    <div className="relative w-full h-[180px] bg-gray-50 flex items-center justify-center">
        <img
            src={img}
            alt="Акция»"
            className="max-w-full max-h-full object-contain"
            sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px)"
        />

        <button className="w-8 h-8 p-1.5 bg-white/90 hover:bg-[#fcd5ba] absolute top-2 right-2 rounded-full cursor-pointer duration-300 flex items-center justify-center shadow-sm">
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

    </div>

    <div className="flex flex-col p-4 gap-3 flex-1">
        <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-[#ff6633]">{formatPrice(priceByCard)} ₽</span>
                {discountPercent > 0 && (
                   <span className="mb:text-xs text-[#666] ml-1">по карте</span>
                )}
                </div>
            {finalPrice !== basePrice && cardDiscountPercent > 0 && (
              <div className="flex items-baseline gap-1">
                <span className="mb:text-sm line-through text-[#999]">{formatPrice(finalPrice)} ₽</span>
                <p className="mb:text-xs text-[#999] ml-1 text-right">обычная</p>
            </div>
            )}

        </div>

        <div className="text-[15px] text-[#414141] font-medium leading-snug line-clamp-2 flex-1">
            {description}
        </div>

        <div className="flex items-center gap-2">
            <div className="flex text-amber-500 text-lg">
                {rating > 0 && <StarRating rating={rating}/>}
            </div>
            <span className="text-sm text-[#666]">(4.8)</span>
        </div>

        <button className="border border-[#70c05b] bg-[#70c05b] hover:bg-[#5caa46] text-white w-full h-10 rounded-lg text-base font-medium transition-colors duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center">
            В корзину
        </button>
    </div>
</div>
    );
}
export default ProductCard;