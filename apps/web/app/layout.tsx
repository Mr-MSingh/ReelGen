import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import LanguageProvider from "./language-provider";
import { LANGUAGE_COOKIE, resolveSiteLanguage } from "./site-language";
import ThemeProvider from "./theme-provider";

export const metadata: Metadata = {
  title: "ReelGen",
  description: "Faceless video generation and publishing for creators.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLanguage = resolveSiteLanguage(
    cookieStore.get(LANGUAGE_COOKIE)?.value
  );

  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("reelgen-theme");
                  var language = localStorage.getItem("reelgen-language");
                  if (theme === "dark" || theme === "light") {
                    document.documentElement.dataset.theme = theme;
                  }
                  if (language === "en" || language === "hi") {
                    document.documentElement.lang = language;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <LanguageProvider initialLanguage={initialLanguage}>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
