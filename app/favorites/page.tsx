import { getDB } from "@/api-routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductCard from "@/app/components/ProductCard";
import { ProductCardProps } from "@/app/types/product";
import Link from "next/link";

interface FavoriteDocument {
  userId: string;
  items: ProductCardProps[];
  updatedAt?: Date;
}

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4 text-[#414141]">Войдите, чтобы видеть избранное</h1>
                <Link href="/login" className="text-[#70C05B] underline font-medium">Войти в аккаунт</Link>
            </div>
        );
    }

    const db = await getDB();

    const favorites = await db.collection<FavoriteDocument>('favorites').findOne({
        userId: session.user.id
    });

    const items = favorites?.items || [];

    return (
        <main className="min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-[1208px]">
                {/* Хлебные крошки */}
                <nav className="flex gap-2 text-sm text-[#8f8f8f] mb-6">
                    <Link href="/" className="hover:text-[#70C05B] transition-colors">Главная</Link>
                    <span>/</span>
                    <span className="text-[#414141]">Избранное</span>
                </nav>

                <h1 className="text-3xl font-bold mb-8 text-[#414141]">Избранное</h1>

                {items.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">❤️</div>
                        <p className="text-[#414141] mb-6 text-lg">В списке избранного пока ничего нет</p>
                        <Link
                            href="/"
                            className="inline-block bg-[#70C05B] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5da34b] transition-all"
                        >
                            Начать покупки
                        </Link>
                    </div>
                ) : (
                    /* Сетка карточек */
                    <div className="flex flex-wrap gap-6 justify-start">
                        {items.map((product) => (
                            <ProductCard
                                key={String(product._id)}
                                {...product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}