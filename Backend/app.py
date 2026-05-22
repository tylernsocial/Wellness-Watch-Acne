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