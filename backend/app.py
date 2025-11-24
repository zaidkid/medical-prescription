import os
import re
import json
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS

from easy_ocr import easy_ocr_extract, gemini_medical_ocr
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import DistilBertTokenizerFast, DistilBertForTokenClassification

app = Flask(__name__)
CORS(app)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print("🚀 Using device:", DEVICE)


# Load Models
print("\n📌 Loading Medical Classifier...")
clf_tokenizer = BertTokenizer.from_pretrained("models/Medical_classifier_model")
clf_model = BertForSequenceClassification.from_pretrained("models/Medical_classifier_model")
clf_model.to(DEVICE).eval()

with open("models/Medical_classifier_model/label_map.json") as f:
    label_map = json.load(f)
id2label = {v: k for k, v in label_map.items()}

print("\n📌 Loading Medical NER...")
ner_tokenizer = DistilBertTokenizerFast.from_pretrained("models/medicine_ner_model")
ner_model = DistilBertForTokenClassification.from_pretrained("models/medicine_ner_model")
ner_model.to(DEVICE).eval()

NER_LABELS = {0: "O", 1: "B-MED", 2: "I-MED"}


# 1️⃣ OCR
def run_ocr(image_path):
    raw_text = easy_ocr_extract(image_path)
    clean_text = gemini_medical_ocr(image_path, raw_text)
    return raw_text, clean_text


# 2️⃣ Classifier
def classify_medical_text(text):
    enc = clf_tokenizer(text, return_tensors="pt", padding=True,
                        truncation=True, max_length=200)
    enc = {k: v.to(DEVICE) for k, v in enc.items()}
    with torch.no_grad():
        logits = clf_model(**enc).logits
        pred = torch.argmax(logits, dim=1).item()
    return id2label[pred]


# 3️⃣ NER for Medicines & Entities
def ner_extract(text):
    enc = ner_tokenizer(text, return_tensors="pt", truncation=True)
    enc = {k: v.to(DEVICE) for k, v in enc.items()}
    with torch.no_grad():
        output = ner_model(**enc)
        preds = torch.argmax(output.logits, dim=2)[0].cpu().tolist()

    tokens = ner_tokenizer.convert_ids_to_tokens(enc["input_ids"][0])

    meds, current = [], []
    for tok, label in zip(tokens, preds):
        tok = tok.replace("##", "")
        tag = NER_LABELS[label]

        if tag == "B-MED":
            if current:
                meds.append(" ".join(current))
            current = [tok]
        elif tag == "I-MED":
            current.append(tok)
        else:
            if current:
                meds.append(" ".join(current))
                current = []

    if current:
        meds.append(" ".join(current))

    return list(set(meds))


# ⭐ NEW — Advanced Medical Structuring Logic
def format_medical_text(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    structured = {
        "doctor": None,
        "qualification": None,
        "clinic": None,
        "patient_info": None,
        "symptoms": [],
        "vitals": {},
        "prescribed": [],
        "instructions": []
    }

    for line in lines:

        if line.startswith("Dr."):
            structured["doctor"] = line
        elif re.search(r"MBBS|MD|DNB", line, re.IGNORECASE):
            structured["qualification"] = line
        elif "Clinic" in line or "Medical" in line:
            structured["clinic"] = line
        elif re.search(r"Age|Gender", line):
            structured["patient_info"] = line

        # Symptoms
        elif line.startswith("C/O") or line.startswith("CO"):
            structured["symptoms"].append(line.replace("C/O", "").strip())

        # Vitals
        elif re.search(r"(BP|Blood Pressure)", line, re.IGNORECASE):
            structured["vitals"]["blood_pressure"] = line
        elif re.search(r"(Pulse|P-)", line, re.IGNORECASE):
            structured["vitals"]["pulse"] = line

        # Medicines (num or dash format)
        elif re.search(r"\d", line) or "-" in line:
            structured["prescribed"].append(line)

        else:
            structured["instructions"].append(line)

    return structured


# 🚀 API Endpoint
@app.route("/process", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    img_file = request.files["image"]
    img_path = "uploaded_image.jpg"
    img_file.save(img_path)

    raw, clean = run_ocr(img_path)
    doc_type = classify_medical_text(clean)
    meds = ner_extract(clean)
    structured = format_medical_text(clean)

    return jsonify({
        "raw_ocr": raw,
        "clean_text": clean,
        "predicted_class": doc_type,
        "medicines": meds,
        "structured_data": structured
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
