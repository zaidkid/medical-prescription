"use client";

import { useRef } from "react";

export default function UploadBox() {
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadFile = (file: File) => {
    console.log("Selected file:", file);
    // later: send to backend API
  };

  return (
    <div className="mt-10">
      <button
        onClick={() => fileInput.current?.click()}
        className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-full text-lg hover:opacity-90 transition"
      >
        Upload Prescription
      </button>

      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) uploadFile(e.target.files[0]);
        }}
      />
    </div>
  );
}
