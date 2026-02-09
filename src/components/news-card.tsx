import Card from "@/components/card";
import {Newspaper} from "lucide-react";
import React from "react";
import {Link} from "@/i18n/navigation";
import {NewsDto} from "@/types/NewsDto";
import Image from "next/image";

interface NewsCardProps {
  news: NewsDto;
}

export default function NewsCard({news}: NewsCardProps) {
  return (
    <Card>
      <div className="aspect-[393/200] w-full rounded-[12px] bg-brand-100/50 flex items-center justify-center overflow-hidden">
        {news.photoUrl && news.photoUrl !== "" ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${news.photoUrl}`}
            alt={news.title}
            width={393}
            height={200}
            unoptimized={true}
            className="w-full h-full object-cover"
          />
        ) : (
          <Newspaper className="size-12 text-brand-500/80"/>
        )}
      </div>
      <h2 className="font-semibold mt-2">{news.title}</h2>
      <p className="mt-1 text-sm line-clamp-3">{news.description}</p>
      {news.course && (
        <Link className="mt-3 block bg-brand-500 text-white text-center py-2 rounded-xl font-medium" href={`/class/courses/${news.course.id}`}>
          立即報名
        </Link>
      )}
      {news.url && (
        <Link target="_blank" className="mt-3 block bg-brand-500 text-white text-center py-2 rounded-xl font-medium" href={news.url}>
          查看詳情
        </Link>
      )}
    </Card>
  )
}
