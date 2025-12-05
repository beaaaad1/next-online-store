
import ProductCard from "./ProductCard";
import { ProductCardProps } from "@/app/types/product";
import {shuffleArray} from "@/app/utils/shuffleArray";
import ViewAllButton from "@/app/components/ViewAllButton";

const Actions = async () => {
    let products: ProductCardProps[] = [];
    let error = null;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVICE_URL!}/api/products?category=actions`,
        );
        products = await res.json();

        products = shuffleArray(products);
    } catch (err) {
        error = "Ошибка получения статей";
        console.error("Ошибка в компоненте Article:", err);
    }

    if (error) {
        return <div className="text-red-500">Ошибка: {error}</div>;
    }
    return (
        <section>
            <div className="flex flex-col justify-center xl:max-w-[1208px]">
                <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
                    <h2 className="text-2xl xl:text-4xl text-left font-bold">Акции</h2>
                    <ViewAllButton btnText="Все акции" href="actions"/>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
                    {products.slice(0, 4).map((item, index) => (
                        <li key={item._id}
                            className={`${index >= 4 ? "hidden" : ""}
                            ${index >= 3 ? "md:hidden xl:block" : ""}
                            ${index >= 4 ? "xl:hidden" : ""}
                            `}
                        >
                            <ProductCard {...item} />
                        </li>
                    ))}

                </ul>
            </div>
        </section>
    );
}
export default Actions;