"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("results");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.push("/upload");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen px-6 py-24 bg-[#F8F5EF] flex justify-center items-center">
        <div className="text-center">
          <div className="h-14 w-14 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Processing your prescription...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     🔍 STRUCTURED EXTRACTION FROM CLEAN OCR TEXT
  ========================================================== */
  const lines =
    data.clean_text
      ?.split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean) || [];

  let doctor: string | null = null;
  let patient: string | null = null;
  let address: string | null = null;
  let symptoms: string[] = [];
  let vitals: { pulse?: string; bp?: string } = {};
  let medicines: string[] = [];

  lines.forEach((line: string) => {
    // Doctor line
    if (/^Dr\./i.test(line)) {
      doctor = line;
      return;
    }

    // Patient info
    if (/Age|Sex|Male|Female|M\s*F/i.test(line)) {
      patient = line;
      return;
    }

    // C/O lines: could be address OR symptom
    if (/^C\/?O/i.test(line)) {
      const content = line.replace(/^C\/?O/i, "").trim();

      // If looks like address/clinic/pharmacy → treat as address
      if (/(store|clinic|hospital|medical)/i.test(content)) {
        address = content;
      } else {
        // Otherwise treat as symptom
        symptoms.push(content);
      }
      return;
    }

    // Vitals
    if (/BP/i.test(line)) {
      vitals.bp = line;
      return;
    }

    if (/P\s*-\s*\d+/i.test(line)) {
      vitals.pulse = line;
      return;
    }

    // Medicines (simple rule: contains medicine-ish tokens)
    if (/\b(plus|gargles|tab|tablet|cap|mg|ml)\b/i.test(line)) {
      medicines.push(line.trim());
      return;
    }
  });

  const structured = {
    documentType: data.predicted_class || "Medical Prescription",
    doctor,
    patient,
    address,
    symptoms,
    vitals,
    medicines,
  };

  /* =========================================================
     📄 PDF EXPORT
  ========================================================== */
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFont("helvetica", "bold");
    doc.text("MediVision AI - Digital Prescription Report", 10, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.text(`Document Type: ${structured.documentType}`, 10, y);
    y += 8;

    if (structured.doctor) {
      doc.text(`Doctor: ${structured.doctor}`, 10, y);
      y += 8;
    }

    if (structured.patient) {
      doc.text(`Patient: ${structured.patient}`, 10, y);
      y += 8;
    }

    if (structured.address) {
      doc.text(`Address: ${structured.address}`, 10, y);
      y += 8;
    }

    if (structured.medicines.length > 0) {
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.text("Prescribed Medicines:", 10, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      structured.medicines.forEach((m: string) => {
        doc.text(`• ${m}`, 12, y);
        y += 7;
      });
    }

    doc.save("MediVision_Report.pdf");
  };

  /* ========================================================= */

  return (
    <div className="min-h-screen px-6 py-24 bg-[#F8F5EF] flex justify-center">
      <motion.div className="w-full max-w-4xl space-y-8">

        {/* SUCCESS BANNER */}
        <div className="flex items-center gap-3 bg-green-100 border border-green-400 rounded-xl px-5 py-3">
          <CheckCircle className="text-green-700" />
          <p className="font-medium text-green-800">
            Scan Completed Successfully!
          </p>
        </div>

        {/* DOCUMENT TYPE */}
        <Card title="Document Type">
          <p className="text-gray-900 font-medium text-lg">
            {structured.documentType}
          </p>
        </Card>

        {/* DOCTOR */}
        {structured.doctor && (
          <Card title="Doctor">
            <p className="text-gray-800">{structured.doctor}</p>
          </Card>
        )}

        {/* PATIENT */}
        {structured.patient && (
          <Card title="Patient">
            <p className="text-gray-800">{structured.patient}</p>
          </Card>
        )}

        {/* ADDRESS / PHARMACY */}
        {structured.address && (
          <Card title="Clinic / Pharmacy Address">
            <p className="text-gray-800">{structured.address}</p>
          </Card>
        )}

        {/* SYMPTOMS */}
        {structured.symptoms.length > 0 && (
          <Card title="Symptoms / Illness">
            <ul className="list-disc ml-6 text-gray-800">
              {structured.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* VITALS */}
        {(structured.vitals.pulse || structured.vitals.bp) && (
          <Card title="Vitals">
            {structured.vitals.pulse && (
              <p className="text-gray-800">Pulse: {structured.vitals.pulse}</p>
            )}
            {structured.vitals.bp && (
              <p className="text-gray-800">BP: {structured.vitals.bp}</p>
            )}
          </Card>
        )}

        {/* MEDICINES */}
        {structured.medicines.length > 0 && (
          <Card title="Prescribed Medicines">
            <ul className="list-disc ml-6 text-gray-800">
              {structured.medicines.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* CLEAN OCR TEXT */}
        <Card title="OCR Extracted Text">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="flex items-center gap-2 text-teal-600 font-medium"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${showRawText ? "rotate-180" : ""}`}
            />
            Show / Hide
          </button>

          {showRawText && (
            <p className="text-gray-700 mt-3 whitespace-pre-line">
              {data.clean_text}
            </p>
          )}
        </Card>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between mt-6">
          <ActionBtn
            outlined
            label="Back to Upload"
            icon={<ArrowLeft size={20} />}
            onClick={() => router.push("/upload")}
          />
          <ActionBtn
            label="Download PDF"
            icon={<Download size={20} />}
            onClick={handleDownloadPDF}
          />
        </div>

      </motion.div>
    </div>
  );
}

/******** REUSABLE UI COMPONENTS ********/
const Card = ({ title, children }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);

const ActionBtn = ({ label, icon, outlined, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition
      ${
        outlined
          ? "text-gray-700 border border-gray-400 hover:bg-gray-200"
          : "bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-lg hover:opacity-95"
      }`}
  >
    {icon}
    {label}
  </motion.button>
);
