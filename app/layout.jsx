import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const font = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const metadata = {
  title: "DXF Generator",
  description: "DXF Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="hydrated">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-M1BR7M2R2T"
        ></Script>
        <Script src="/js/gana.js"></Script>
        <Script src="/js/gtag.js"></Script>
      </head>
      <body className={`${font.className} antialiased`}>
        {children}
        <Toaster />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-ND7W9QSN"
            height="0"
            width="0"
            className="hidden"
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
