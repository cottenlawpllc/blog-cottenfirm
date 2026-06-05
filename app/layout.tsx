import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "NC Traffic & Criminal Defense | Cotten Firm Law Blog",
    template: "%s | Cotten Firm"
  },
  description: "North Carolina traffic and criminal defense legal guides from attorney Jeremy Cotten. Serving Wake, Johnston, Harnett, Chatham, and Orange counties.",
  metadataBase: new URL("https://blog.cottenfirm.com"),
  openGraph: {
    siteName: "Cotten Firm Law Blog",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@spokestatutejc",
  },
  alternates: {
    canonical: "https://blog.cottenfirm.com",
  },
  verification: {
    google: "Jw0REpOwUZOYrRLZYp3kV4oBQOJa1lDH9mrhS8ceBGE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-700">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="https://blog.cottenfirm.com" className="flex items-center gap-3">
              <div>
                <div className="text-white font-bold text-lg leading-tight">Cotten Firm, PLLC</div>
                <div className="text-slate-400 text-xs">NC Traffic & Criminal Defense</div>
              </div>
            </a>
            <a
              href="https://portal.cottenfirm.com"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Sign Up Now →
            </a>
          </div>
        </header>

        {/* Main */}
        <main className="min-h-screen bg-white">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-700">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="text-white font-semibold mb-1">Cotten Firm, PLLC</div>
                <div className="text-sm">Traffic & Criminal Defense • Fuquay-Varina, NC</div>
                <div className="text-sm mt-1">Serving Wake, Johnston, Harnett, Chatham & Orange counties</div>
              </div>
              <div className="text-sm">
                <div><a href="tel:+19195867072" className="hover:text-white">(919) 586-7072</a></div>
                <div><a href="https://portal.cottenfirm.com" className="hover:text-white">Client Portal</a></div>
                <div className="mt-2 text-xs text-slate-500">© {new Date().getFullYear()} Cotten Firm, PLLC. All rights reserved.</div>
                <div className="text-xs text-slate-500 mt-1">This blog is for informational purposes only and does not constitute legal advice.</div>
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
