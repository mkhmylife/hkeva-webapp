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
  appleWebApp: {
    capable: false,
    statusBarStyle: "default",
    title: "HKEVA",
  },
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
    <head>
      <link rel="apple-touch-icon" href="/images/icon.jpg" />
    </head>
    <body
      className="antialiased"
    >
    <Providers>
      <NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_IS_BETA === "1" ? (
          <div className="text-xs text-center bg-yellow-500 w-full font-medium">
            Testing Environment
          </div>
        ) : null}
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
