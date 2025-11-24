import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#EDE8DF] border-t border-[#D4CCC0] py-14 mt-24 relative overflow-hidden">

      {/* Gradient Blobs */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-teal-300/25 blur-[150px] top-[-140px] left-[-150px]" />
      <div className="absolute w-[380px] h-[380px] rounded-full bg-purple-300/25 blur-[170px] bottom-[-140px] right-[-120px]" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] bg-[size:42px_42px]" />

      {/* Footer Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          MediVision AI
        </h2>

        <p className="text-[#3d3d3d] text-lg mt-3 max-w-xl mx-auto leading-relaxed">
          Transform handwritten prescriptions into clean, structured digital medical data using
          advanced AI-powered OCR, classification, and NER models.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-[#D8D2C7] mt-8 mb-5" />

        <p className="text-[#4b4b4b] text-sm">
          © {new Date().getFullYear()} MedScan AI — Precision Medical Document Intelligence.
        </p>
      </div>
    </footer>
  );
}
