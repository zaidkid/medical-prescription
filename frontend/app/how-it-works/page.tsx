"use client";

import { motion } from "framer-motion";
import { UploadCloud, Brain, FileCheck } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: UploadCloud,
      title: "Upload Prescription",
      desc: "Simply upload an image or PDF of a handwritten medical prescription.",
      delay: 0.2,
    },
    {
      icon: Brain,
      title: "AI Analysis & Extraction",
      desc: "OCR + NER models extract medicines, dosage, frequency & diagnosis accurately.",
      delay: 0.4,
    },
    {
      icon: FileCheck,
      title: "Structured Digital Output",
      desc: "Receive clean and actionable medical text ready for EHR systems or pharmacy usage.",
      delay: 0.6,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] px-6 pb-24 pt-32 relative overflow-hidden">

      {/* Gradient Blobs */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-teal-300/25 blur-[180px] top-[-180px] left-[-140px]" />
      <div className="absolute w-[480px] h-[480px] rounded-full bg-purple-300/25 blur-[200px] bottom-[-160px] right-[-120px]" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] bg-[size:42px_42px]" />

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-serif font-bold text-center text-[#111] relative z-10"
      >
        How It Works
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-center text-gray-700 mt-4 text-lg max-w-2xl mx-auto"
      >
        MedScan AI converts handwritten prescriptions into digital medical insights in seconds.
      </motion.p>

      {/* Timeline Steps */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 mt-16 relative z-10">

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: step.delay }}
            className="bg-white/70 border border-gray-200 backdrop-blur-xl rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all"
          >
            <step.icon className="mx-auto text-teal-600 mb-4" size={52} />
            <h3 className="font-serif font-bold text-2xl text-gray-900">
              {step.title}
            </h3>
            <p className="text-gray-600 mt-2 text-base leading-relaxed">
              {step.desc}
            </p>

            {/* Number Badge */}
            <div className="mt-5 w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 text-white flex items-center justify-center mx-auto text-lg font-bold">
              {i + 1}
            </div>
          </motion.div>
        ))}

      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-center mt-20 relative z-10"
      >
        <Link
          href="/upload"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-teal-600 to-purple-600
        text-white font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.15)]
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition"
        >
          Try It Now →
        </Link>
      </motion.div>
    </div>
  );
}
