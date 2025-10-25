import Card from "@/components/card";
import {Newspaper, Volleyball} from "lucide-react";
import React from "react";
import {Link} from "@/i18n/navigation";

export default function NewsCard() {
  return (
    <Card>
      <div className="aspect-[393/200] w-full rounded-[12px] bg-brand-100/50 flex items-center justify-center">
        <Newspaper className="size-12 text-brand-500/80"/>
      </div>
      <h2 className="font-semibold mt-2">2024 聖誕排球訓練營</h2>
      <p className="mt-1 text-sm line-clamp-3">每年，HKEVA 聖誕訓練營都會邀請海外排球教練來港，為香港學生提供指導，讓未有機會出國的學生，也能在本地學習來自不同國家的排球技術，進而提升個人能力。除了技術層面外，HKEVA 亦重視學生的態度培養，希望透過訓練營，讓學生接觸不同國家的訓練方式及文化，從中獲益。  本次訓練營為期兩天，將分為兩個部分。第一天專注於進攻技巧訓練，包括扣球、攔網和發球；第二天則著重防守訓練，包括接發球、防守及二傳技術。訓練內容將以日本的訓練系統和方法為基礎，教授學生正確的基本技術，期望學生能在短短兩日內掌握這些技術，為未來的發展奠定堅實基礎。  為確保教練能針對不同水平的學生提供有效訓練，今年的兒童及青年訓練營對象為年齡介乎10至14歲且具備穩定基本技能的學生（包括上下手接傳、發球、扣球），不建議初學者參加。  早鳥優惠  第一階段：於2024年10月18日至10月27日內成功報名及完成付款，可享【8折優惠】 第二階段：於2024年10月28日至11月10日內成功報名及完成付款，可享【9折優惠】</p>
      <Link className="mt-3 block bg-brand-500 text-white text-center py-2 rounded-xl font-medium" href="/">
        立即報名
      </Link>
    </Card>
  )
}