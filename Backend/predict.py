## goal of predict.py: 
# load model
# load class names
# preprocess image
# return prediction

import json ## loads class_names.json
import numpy as np ## converts images into an array the model can understand
import tensorflow as tf ## loads final_model.keras and runs predictions
from PIL import Image, UnidentifiedImageError ## used for opening and resizing uploaded images 
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent # find the folder where predict.py is located.
MODEL_PATH = BASE_DIR / "model" / "mobilenetv2_acne_classifier.keras"
CLASS_NAMES_PATH = BASE_DIR / "model" / "class_names.json"

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

def preprocess_image(image_file):
    '''
    prepares an uploaded image so it matches the format expected by the model
    '''
    try:
        img = Image.open(image_file)
        rgb_img = img.convert('RGB')
        resized_img = rgb_img.resize((224, 224))

        img_array = np.array(resized_img).astype("float32")
        img_array = img_array / 255.0 ## normalize pixel values from 0-255 to 0-1 since cnn works better on smaller values
        img_array = np.expand_dims(img_array, axis=0) ## needs to change shape to (x,y,z) to (n,x,y,z) since that is what the model requires since images were sent it batches, (1 image, 224 height, 224 width, 3 colour channels)
        
        return img_array
    except UnidentifiedImageError:
        raise ValueError("Uploaded file is not a valid image.")

def predict_acne_class(image_file):
    '''
    runs the model on an image and returns the predicted class and confidence 
    '''

    processed_img = preprocess_image(image_file)
    predictions = model.predict(processed_img) ## model sends back a list of prediction scores ie:[[0.05, 0.10, 0.80, 0.05]]
    predicted_index = int(np.argmax(predictions[0])) ## finds the index with the largest prediction score predictions[0] = [0.05, 0.10, 0.80, 0.05] since batches
    confidence = float(np.max(predictions[0])) ## get the largest prediction score
    predicted_class = class_names[predicted_index] ## get the class based on the found index with the largest predicted score

    return {
        "prediction": predicted_class,
        "confidence": round(confidence * 100, 2)
    }

## test
# if __name__ == "__main__":
#     result = predict_acne_class("test.jpg")
#     print(result)