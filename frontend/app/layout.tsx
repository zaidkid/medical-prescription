import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "MediVision AI",
  description: "AI-powered prescription digitization",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F8F5EF]">
        <Navbar />
        
        <main className="pt-24"> {/* Prevent content hiding behind navbar */}
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
