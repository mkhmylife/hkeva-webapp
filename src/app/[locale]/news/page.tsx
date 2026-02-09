import {getTranslations} from "next-intl/server";
import NewsCard from "@/components/news-card";
import {getNews} from "@/libs/news";

export default async function NewsPage() {

  const t = await getTranslations();

  const news = await getNews();

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <h2 className="font-semibold text-lg">{t('News.title')}</h2>

      <div className="mt-3 space-y-3">
        {news.map((item) => (
          <NewsCard key={`news-${item.id}`} news={item} />
        ))}
      </div>
    </div>
  )

}