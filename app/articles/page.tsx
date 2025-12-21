import articlesDatabase from "@/migrations/articlesDatabase.json";
import Image from "next/image";
import Link from "next/link";

export default function AllArticlesPage() {
  const articles = articlesDatabase;

  return (
    <main className="bg-[#F9F9F9] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1208px]">

        <div className="mb-8">
          <nav className="flex gap-2 text-sm text-[#8f8f8f] mb-4">
            <Link href="/" className="hover:text-[#70C05B]">Главная</Link>
            <span>/</span>
            <span className="text-[#414141]">Все статьи</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-[#414141]">Все статьи</h1>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <li key={article.id} className="min-h-[420px]">
              <article className="bg-white h-full flex flex-col rounded overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-article) duration-300 border border-gray-100">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    className="object-cover"
                    quality={100}
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col gap-y-3 leading-[1.5]">
                  <time className="text-[10px] text-[#8f8f8f]">
                    {new Date(article.createdAt).toLocaleDateString("ru-RU")}
                  </time>
                  <h3 className="text-[#414141] text-lg font-bold">
                    {article.title}
                  </h3>
                  <p className="text-[#414141] line-clamp-3 text-sm">
                    {article.text}
                  </p>

                  <Link
                    href={`/articles/${article.id}`}
                    className="rounded mt-auto w-40 h-10 flex items-center justify-center
                               bg-[#E5FFDE] text-base text-[#70C05B]
                               hover:bg-[#70C05B] hover:text-white
                               duration-300 font-medium"
                  >
                    Подробнее
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}