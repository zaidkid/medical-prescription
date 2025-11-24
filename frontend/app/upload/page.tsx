"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadBox() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [loadingStep, setLoadingStep] = useState<number | null>(null);

  const steps = [
    "Uploading file...",
    "Extracting Text...",
    "Processing with AI...",
    "Generating Structured Report..."
  ];

  const handleUpload = (file: File) => {
    setFile(file);
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoadingStep(0);

    const formData = new FormData();
    formData.append("image", file);

    const progressInterval = setInterval(() => {
      setLoadingStep((prev) =>
        prev !== null && prev < steps.length - 1 ? prev + 1 : prev
      );
    }, 1800);

    try {
      const res = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      localStorage.setItem("results", JSON.stringify(data));

      setLoadingStep(steps.length - 1);

      setTimeout(() => {
        router.push("/result");
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      setLoadingStep(null);
      alert("Error processing the file. Try again!");
    }
  };

  // Loading UI
  if (loadingStep !== null) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8F5EF] px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
          className="h-16 w-16 border-4 border-gray-300 border-t-teal-600 rounded-full"
        />
        <p className="mt-6 text-xl font-semibold text-gray-800 animate-pulse text-center">
          {steps[loadingStep]}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Please wait 5-10 seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F5EF] flex flex-col items-center px-6 py-28">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-700 font-medium mb-10 self-start"
      >
        <ArrowLeft size={20} className="text-teal-600" />
        Back to Home
      </motion.button>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-xl p-10 rounded-3xl backdrop-blur-xl 
        bg-white/60 shadow-xl border"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) handleUpload(droppedFile);
        }}
      >

        {/* Drag Overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-teal-200 rounded-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="flex justify-center mb-4 z-10">
          <UploadCloud size={60} className="text-teal-600 opacity-90" />
        </div>

        <h2 className="text-3xl font-serif font-bold text-center text-gray-900">
          Upload Prescription
        </h2>

        <p className="text-gray-600 text-center mt-2 font-medium">
          Drag & drop or browse files
        </p>

        {/* Drop Zone */}
        <div
          className="mt-6 border-2 border-dashed border-gray-400/60 rounded-xl 
          py-12 px-4 text-center bg-white/40 cursor-pointer"
          onClick={() => fileInput.current?.click()}
        >
          {!file ? (
            <>
              <p className="text-gray-700 font-semibold text-lg">
                Drag your file here
              </p>
              <p className="text-gray-500 text-sm mt-1">
                JPG • PNG • HEIC • PDF
              </p>
            </>
          ) : (
            <p className="text-teal-700 font-semibold">📄 {file.name}</p>
          )}
        </div>

        {/* Hidden input */}
        <input
          type="file"
          ref={fileInput}
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 z-10">
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full py-3 border border-gray-400 rounded-full text-gray-700 font-semibold"
          >
            Select Another File
          </button>

          <button
            disabled={!file}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-full font-semibold text-white transition
              ${
                file
                  ? "bg-gradient-to-r from-teal-600 to-purple-600 shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Submit & Continue →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
