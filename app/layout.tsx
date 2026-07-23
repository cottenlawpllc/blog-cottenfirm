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
              href="https://portal.cottenfirm.com?utm_source=blog&utm_medium=header&utm_campaign=hire"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Hire Us Now →
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
                <a
                  href="https://portal.cottenfirm.com?utm_source=blog&utm_medium=footer&utm_campaign=hire"
                  className="inline-block mb-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Hire Us Now →
                </a>
                <div className="flex items-center gap-3 mb-3">
                  <a
                    href="https://www.facebook.com/cottenlawpllc"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                    className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#3b8bf4] flex items-center justify-center transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/spokestatutejc"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on X"
                    className="w-10 h-10 rounded-full bg-black border border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-colors"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCHYcXMoHWvhAcFimmFvM60Q"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe on YouTube"
                    className="w-10 h-10 rounded-full bg-[#FF0000] hover:bg-[#ff3333] flex items-center justify-center transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                    </svg>
                  </a>
                </div>
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
