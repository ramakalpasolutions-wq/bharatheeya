// src/app/layout.js
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "The Bharatheeya Seva Welfare Society",
  description: "Empowering Lives Through Education, Human Rights & Social Welfare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-[#FFF8E7] min-h-screen font-georgia">
        <Header />
        
        <main className="min-h-screen pt-24 lg:pt-30">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
