import google.generativeai as genai
import base64
import os

# -------------------------------------------------------
# CONFIGURE GEMINI
# -------------------------------------------------------
# 🔑 Replace this with your actual API key
genai.configure(api_key="AIzaSyDavFcUasq3vPZw2d67Ht7T2V6x8Ti-qxo")

model = genai.GenerativeModel("gemini-2.5-flash")


# -------------------------------------------------------
# IMAGE ENCODING
# -------------------------------------------------------
def encode_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")


# -------------------------------------------------------
# SIMPLE OCR USING GEMINI
# -------------------------------------------------------
def gemini_ocr(image_path):
    img_data = encode_image(image_path)

    response = model.generate_content([
        {
            "mime_type": "image/jpeg",
            "data": img_data
        },
        "Extract all readable text from this image. Return clean OCR text only."
    ])

    return response.text


# -------------------------------------------------------
# MEDICAL PRESCRIPTION STRUCTURED OCR
# -------------------------------------------------------
def gemini_medical_ocr(image_path):
    img_data = encode_image(image_path)

    prompt = """
    You are a medical OCR assistant.
    Extract information from the prescription and return JSON with:

    {
      "patient_name": "",
      "doctor_name": "",
      "medicines": [
        {"name": "", "dosage": "", "frequency": "", "duration": ""}
      ],
      "notes": ""
    }

    Fix handwriting errors, interpret abbreviations (e.g., BID, TID).
    """

    response = model.generate_content([
        {"mime_type": "image/jpeg", "data": img_data},
        prompt
    ])

    return response.text


# -------------------------------------------------------
# MAIN PROGRAM
# -------------------------------------------------------
if __name__ == "__main__":
    print("=== GEMINI OCR SYSTEM ===")
    image_path = input("Enter the image file path: ")

    if not os.path.exists(image_path):
        print("❌ Error: File not found!")
        exit()

    print("\n1. Simple OCR")
    print("2. Medical Prescription OCR")
    choice = input("Choose an option (1/2): ")

    if choice == "1":
        result = gemini_ocr(image_path)
    else:
        result = gemini_medical_ocr(image_path)

    print("\n===== OCR RESULT =====\n")
    print(result)
