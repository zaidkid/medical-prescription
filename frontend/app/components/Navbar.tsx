"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -35, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300
        ${
          scrolled
            ? "backdrop-blur-xl bg-[#ffffff]/80 shadow-[0_4px_18px_rgba(0,0,0,0.08)]"
            : "bg-[#F8F5EF]/60 backdrop-blur-lg"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <Stethoscope
            size={26}
            className="text-teal-600 group-hover:text-teal-700 transition"
          />
          <span className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
            MediVision
            <span className="bg-gradient-to-r from-teal-600 to-purple-600 text-transparent bg-clip-text ml-1">
              AI
            </span>
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center space-x-10 font-serif font-extrabold tracking-wide">
          <NavLink label="Home" href="/" />
          <NavLink label="How It Works" href="/how-it-works" />
          <NavLink label="Technology" href="/technology" />
        </div>

        {/* CTA BUTTON */}
        <Link
          href="/upload"
          className="px-5 py-2.5 rounded-full font-semibold text-white 
            bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500
            shadow-[0_4px_14px_rgba(0,0,0,0.18)]
            hover:shadow-[0_6px_18px_rgba(0,0,0,0.22)]
            hover:opacity-95 transition-all"
        >
          Try Demo
        </Link>

      </div>
    </motion.nav>
  );
}

const NavLink = ({ label, href }: { label: string; href: string }) => (
  <Link href={href} className="relative group text-gray-800 hover:text-gray-950 transition">
    {label}
    <span
      className="absolute left-0 -bottom-1 h-[2px] w-0 
        bg-gradient-to-r from-teal-500 to-purple-500 
        group-hover:w-full transition-all duration-300 rounded-full"
    />
  </Link>
);
