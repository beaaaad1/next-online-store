import { Article } from "@/app/types/articles";
import articlesDatabase from "@/migrations/articlesDatabase.json";
import Link from "next/link";
import Image from "next/image";

interface IArticleData {
  id: number;
  img: string;
  title: string;
  text: string;
  createdAt: string;
  fullText?: string;
}

async function getArticleData(id: string): Promise<IArticleData | null> {
  const article = articlesDatabase.find((a) => String(a.id) === id);

  if (!article) return null;
  return article as unknown as IArticleData;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleData(slug);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#414141]">Статья не найдена</h1>
        <Link href="/" className="text-[#70C05B] underline font-medium">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

        <nav className="flex items-center gap-2 text-sm text-[#8f8f8f] py-8">
          <Link href="/" className="hover:text-[#70C05B] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-[#414141]">Статьи</span>
        </nav>

        <article className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">

          <div className="relative w-full h-[250px] md:h-[450px]">
            <Image
              src={article.img}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 md:p-12">
            <time className="text-sm text-[#8f8f8f] block mb-4 font-medium">
              {new Date(article.createdAt).toLocaleDateString("ru-RU", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>

            <h1 className="text-3xl md:text-5xl font-bold text-[#414141] mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl text-[#000] font-medium mb-8 italic border-l-4 border-[#125DF2] pl-4">
              {article.text}
            </p>

            <div className="text-[#414141] text-base md:text-lg leading-[1.8] space-y-6 whitespace-pre-line">
              {article.fullText || article.text}
            </div>

            <div className="mt-12 pt-10 border-t border-gray-100">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 h-12 rounded-lg bg-[#E5FFDE] text-[#70C05B] font-bold hover:bg-[#125DF2] hover:text-white transition-all duration-300"
              >
                ← Вернуться к списку статей
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}