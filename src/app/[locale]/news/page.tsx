import {getTranslations} from "next-intl/server";
import NewsCard from "@/components/news-card";
import {getNews} from "@/libs/news";
import Card from "@/components/card";
import {Newspaper} from "lucide-react";

export default async function NewsPage() {

  const t = await getTranslations();

  const news = await getNews();

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <h2 className="font-semibold text-lg">{t('News.title')}</h2>

      <div className="mt-3">
        {news.length === 0 ? (
          <Card className="h-[300px] flex flex-col justify-center items-center">
            <div className="w-[80px] h-[80px] bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Newspaper className="w-[40px] h-[40px] text-primary"/>
            </div>
            <p className="font-semibold text-xl text-brand-neutral-900">{t('News.no-news')}</p>
            <p className="text-sm text-brand-neutral-500 mt-2">{t('News.no-news-description')}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <NewsCard key={`news-${item.id}`} news={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )

}