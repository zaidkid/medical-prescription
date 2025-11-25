import easyocr
import google.generativeai as genai
import base64
import os

# -------------------------------------------------------
# CONFIGURE GEMINI
# -------------------------------------------------------
genai.configure(api_key="YOUR_GEMINI_API_KEY_HERE")
model = genai.GenerativeModel("gemini-2.5-flash")

# -------------------------------------------------------
# IMAGE BASE64 ENCODING
# -------------------------------------------------------
def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

# -------------------------------------------------------
# EASY OCR EXTRACTION
# -------------------------------------------------------
def easy_ocr_extract(image_path):
    reader = easyocr.Reader(['en'])
    result = reader.readtext(image_path, detail=0)
    return "\n".join(result)

# -------------------------------------------------------
# GEMINI OCR CORRECTION
# -------------------------------------------------------
def gemini_medical_ocr(image_path, easy_text):
    img_data = encode_image(image_path)

    prompt = f"""
You are an OCR correction model.

Below is the raw OCR text extracted from EasyOCR:

RAW_OCR_TEXT:
{easy_text}

Your task:
- Fix spelling mistakes
- Correct handwriting errors
- Output clean readable text ONLY
- Do NOT add extra information
- Do NOT format into JSON or paragraphs.
"""

    response = model.generate_content([
        {"mime_type": "image/jpeg", "data": img_data},
        prompt
    ])

    return response.text.strip()


if __name__ == "__main__":

    image_path = "images/image1.png"   # <-- put your image file here

    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        exit()

    # 1️⃣ EasyOCR extraction
    print("\n🔍 Extracting with EasyOCR...")
    easy_text = easy_ocr_extract(image_path)

    print("\n===== EASY OCR RAW TEXT =====\n")
    print(easy_text)

    # 2️⃣ Gemini correction
    print("\n🤖 Cleaning OCR using Gemini...")
    corrected = gemini_medical_ocr(image_path, easy_text)

    print("\n===== GEMINI CORRECTED OCR =====\n")
    print(corrected)
