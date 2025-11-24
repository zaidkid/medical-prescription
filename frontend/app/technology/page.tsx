"use client";

import { motion } from "framer-motion";
import { ScanText, BrainCircuit, FileCheck } from "lucide-react";
import Link from "next/link";

export default function Technology() {
  const features = [
    {
      icon: ScanText,
      title: "Advanced OCR Engine",
      desc: "Interprets and converts handwritten prescriptions into clean digital text even from low quality scans.",
    },
    {
      icon: BrainCircuit,
      title: "Clinical NER Model",
      desc: "Extracts medicines, dosage, frequency, diagnosis and relevant medical entities with high precision.",
    },
    {
      icon: FileCheck,
      title: "Intelligent Classification",
      desc: "Verifies context and improves safety by validating extracted medical information automatically.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] px-6 pb-32 pt-36 relative overflow-hidden">

      {/* Soft Premium Gradients */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-teal-300/30 blur-[210px] top-[-200px] left-[-180px]" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-purple-300/25 blur-[200px] bottom-[-200px] right-[-150px]" />

      {/* Clean Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111] leading-tight drop-shadow-sm">
          Intelligent Healthcare AI Stack
        </h1>

        <p className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed">
          MedVision AI turns handwritten prescriptions into structured medical knowledge using
          deep learning and advanced NLP technologies.
        </p>
      </motion.div>

      {/* Feature Grid */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-12">
        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-white/75 border border-gray-200/70 backdrop-blur-xl rounded-3xl p-10 text-center 
            shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
            transition-all duration-300"
          >
            <item.icon size={58} className="mx-auto text-teal-600 opacity-95 mb-6" />

            <h3 className="font-serif font-bold text-2xl text-gray-900 mb-3">
              {item.title}
            </h3>

            <p className="text-gray-600 leading-relaxed text-[15.5px]">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="relative z-10 text-center mt-28"
      >
        <Link
          href="/upload"
          className="px-10 py-4 rounded-full text-white font-semibold text-lg
          bg-gradient-to-r from-teal-600 to-purple-600
          shadow-[0_10px_22px_rgba(0,0,0,0.15)]
          hover:shadow-[0_14px_32px_rgba(0,0,0,0.18)]
          transition-all duration-300"
        >
          Try The AI →
        </Link>
      </motion.div>
    </div>
  );
}
