import { Quicksand } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const quicksand = Quicksand({
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
      <body
        className={`${quicksand.className} antialiased`}
        data-new-gr-c-s-check-loaded="14.1256.0"
        data-gr-ext-installed=""
      >
        {children}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-ND7W9QSN"
            height="0"
            width="0"
            style="display:none;visibility:hidden"
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
