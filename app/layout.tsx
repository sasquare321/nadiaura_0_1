import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/lib/UserContext";

export const metadata: Metadata = {
  title: "Nadiaura – Holistic Wellness",
  description: "Your personal AI wellness companion",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        {/* Apply saved theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('nadiaura-theme');
            if (t) document.documentElement.setAttribute('data-theme', t);
          } catch(e){}
        `}} />
      </head>
      <body>
        <UserProvider>
          <ThemeProvider>
            <div className="app-shell">
              <div className="phone-frame">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
