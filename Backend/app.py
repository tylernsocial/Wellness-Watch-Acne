## goal of app.py: essentially will act as the backend server 
# overview:
# react frontend
# User uploads image
        #↓
# Flask backend receives image
        #↓
# predict.py preprocesses image and runs model
        #↓
# Flask backend sends prediction back
        #↓
# React frontend displays result

# will need to routes, get and post route, GET to check if the 
# backend is running and POST to get the prediction but it accepts 
# and image file which means we are sending data to the backend 

# will also need the import CORS since react will use a different port than Flask,
# and by default browsers may block some requests between different origins for security reasons
# CORS(app) allows for the React frontend to call this backend
"""
backend API:
built with flash and exposes a /predict route, which will accept an uploaded
image, preprocesses it, and then sends it through the acne classifier model
and returns the predicted class with a confidence score

example response:
response:

```json
{
  "prediction": "class_name",
  "confidence": 87.42
}
"""



from flask import Flask, request, jsonify 
from flask_cors import CORS 
from predict import predict_acne_class
from pathlib import Path

app = Flask(__name__)
CORS(app)

EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    ext = Path(filename).suffix.lower().replace(".", "") ## gets .JPG -> jpg
    return ext in EXTENSIONS

# ext1 = allowed_file("skin.jpg")
# ext2 = allowed_file("skin.PNG")
# ext3 = allowed_file("data.csv")
# ext4 = allowed_file("bomberman")

# print(ext1, ext2, ext3, ext4)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "The backend server is running!"
    })

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({
            "error": "No image file was uploaded"
        })
    
    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify({
            "error": "No selected file"
        }), 400
    
    if not allowed_file(image_file.filename):
        return jsonify({
            "error": "Invalid file type. Please upload a PNG, JPG, JPEG, or WEBP image."
        }), 400
    
    try:
        result = predict_acne_class(image_file)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)

