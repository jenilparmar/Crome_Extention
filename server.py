from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import base64
from PIL import Image
from io import BytesIO
import google.generativeai as genai
from flask_cors import CORS

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

def get_gemini_response(input_text, image):
    model = genai.GenerativeModel('gemini-1.5-flash')

    if input_text != "" and image is not None:
        response = model.generate_content([input_text, image])
    elif input_text != "":
        response = model.generate_content([input_text])
    else:
        response = model.generate_content([image])

    return response.text

@app.route("/get", methods=["POST"])
def chatbot():
    if request.method == "POST":
        input_text = "give answer of this question in form = (Right answer from option ) i want exact this form. if option is in the form of 1 2 3 4 than also map 1 to A 2 to B and so on. only answer should be A , B,C,D nothing else  "
        
        data = request.json
        uploaded_file = data.get('base64String')

        if uploaded_file:
            # Check if the uploaded file has the proper header
            if uploaded_file.startswith("data:image/"):
                try:
                    header, encoded = uploaded_file.split(",", 1)
                    image_data = base64.b64decode(encoded)
                    image = Image.open(BytesIO(image_data))
                except ValueError:
                    return jsonify({"error": "Invalid Base64 string format"}), 400

            response = get_gemini_response(input_text, image)

            return jsonify({"response": response.strip()})  # Send back the response

    return jsonify({"error": "Invalid request method"}), 405

if __name__ == "__main__":
    app.run(debug=True)
