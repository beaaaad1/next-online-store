import { getDB } from "@/api-routes";
import { formatPrice } from "@/app/utils/formatPrice";
import StarRating from "@/app/components/StarRating";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import { ProductCardProps } from "@/app/types/product";
import { ObjectId } from "mongodb";

async function getProduct(id: string): Promise<ProductCardProps | null> {
  try {
    const db = await getDB();

    console.log("Ищем товар с ID:", id, "Тип:", typeof id);

    const product = await db.collection("products").findOne({
  _id: new ObjectId(id)
    });

    if (!product) {
      console.log("Товар не найден в БД");
      return null;
    }

    return JSON.parse(JSON.stringify(product)) as ProductCardProps;
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Ждем параметры (для Next.js 15)
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h1 className="text-2xl mb-4 text-gray-600">Товар с ID: {id} не найден</h1>
        <Link href="/" className="text-[#70c05b] underline font-medium">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const finalPrice = product.discountPercent
    ? product.basePrice * (1 - product.discountPercent / 100)
    : product.basePrice;

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-6 md:py-10">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#70c05b] transition-colors">Главная</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">

          <div className="p-6 md:p-12 bg-gray-50 flex items-center justify-center border-r border-gray-100">
            <div className="relative w-full h-[300px] md:h-[450px]">
              <img
                src={product.img}
                alt={product.description}
                className="w-full h-full object-contain"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <div className="absolute top-0 left-0 bg-[#ff6633] text-white px-4 py-1.5 rounded-lg shadow-md font-bold">
                  -{product.discountPercent}%
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-12 flex flex-col">
            <h1 className="text-2xl md:text-4xl font-bold text-[#414141] mb-4 leading-tight">
              {product.description}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <StarRating rating={product.rating?.rate || 5} />
              <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">Артикул: {product.id}</span>
            </div>

            <div className="bg-[#f3faf1] p-6 rounded-2xl mb-8 flex items-end gap-6 border border-[#70c05b]/10">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Цена</p>
                <p className="text-4xl md:text-5xl font-extrabold text-[#414141]">
                  {formatPrice(finalPrice)} ₽
                </p>
              </div>
              {product.discountPercent && product.discountPercent > 0 && (
                <div className="mb-1">
                  <p className="text-xl line-through text-gray-400">
                    {formatPrice(product.basePrice)} ₽
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <h3 className="font-bold text-[#414141] text-lg">Характеристики</h3>
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Категория</span>
                  <span className="text-[#414141] font-medium">{product.categories?.join(", ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Вес</span>
                  <span className="text-[#414141] font-medium">{product.weight || "Не указан"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Бренд</span>
                  <span className="text-[#414141] font-medium">{product.title}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <AddToCartButton product={product} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}