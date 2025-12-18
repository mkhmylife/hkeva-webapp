import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/header";
import React from "react";
import Footer from "@/components/footer";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "HKEVA",
  description: "",
};

export default async function RootLayout({
                                           children, params
                                         }: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {

  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
    <body
      className="antialiased"
    >
    <Providers>
      <NextIntlClientProvider>
        <Header />
        <main className="max-w-lg mx-auto pb-20">
          {children}
        </main>
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </Providers>
    </body>
    </html>
  );
}
