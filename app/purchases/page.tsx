
import ProductCard from "@/app/components/ProductCard";
import {ProductCardProps} from "@/app/types/product";
import ViewAllButton from "@/app/components/ViewAllButton";

const AllUserPurchases = async () => {

    let purchases: ProductCardProps[] = [];
  let error = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE_URL!}/api/users/purchases`
    );
    purchases = await res.json();
  } catch (err) {
    error = "Ошибка получения всех купленных продуктов";
    console.error("Ошибка в компоненте AllUserPurchases:", err);
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }
    return (
        <section>
            <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col mt-20 mb-20
            flex flex-col justify-center ">
                <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
                   <h2 className="text-2xl xl:text-4xl text-left font-bold">Покупали раньше</h2>
                    <ViewAllButton btnText="На главную" href="/"/>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
                    {purchases.slice(0, 4).map((item) => (
                        <li key={item._id}

                        >
                            <ProductCard {...item} />
                        </li>
                    ))}

                </ul>
            </div>
        </section>
    );
};
export default AllUserPurchases;