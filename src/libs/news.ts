import {fetcher} from "@/libs/fetcher";
import { NewsDto } from "@/types/NewsDto";

export const getNews = async () => {
  const res = await fetcher('GET', `/app/news`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as NewsDto[];
}