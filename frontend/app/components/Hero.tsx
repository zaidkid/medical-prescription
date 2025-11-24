"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);

  // Generate particles on client
  useEffect(() => {
    const temp = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 4,
    }));
    setParticles(temp);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden bg-[#F8F5EF]">

      {/* Soft Gradient Blobs */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-teal-300/25 blur-[160px] top-[-180px] left-[-150px]" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-purple-300/25 blur-[180px] bottom-[-160px] right-[-120px]" />

      {/* Subtle Medical Grid */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:42px_42px]" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-3xl text-center"
      >
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1A1A1A] leading-tight">
          Prescription →
          <br />
          <span className="bg-gradient-to-r from-teal-700 via-blue-600 to-purple-600 text-transparent bg-clip-text">
            Structured Digital Text
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-[#444] max-w-2xl mx-auto">
          AI-powered medical text extraction using advanced OCR + NER models.  
          Transform handwritten prescriptions into precise digital records instantly.
        </p>

        {/* Redirect to Upload */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/upload")}
          className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 
          text-white font-semibold shadow-lg hover:shadow-xl transition flex items-center gap-2 mx-auto"
        >
          Try Now <ArrowRight size={20} />
        </motion.button>
      </motion.div>

      {/* Floating Particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-[3px] h-[3px] bg-[#aaa] rounded-full"
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
            animate={{
              y: p.y - 30,
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}
