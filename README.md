# Wellness Watch Acne (Custom AI Acne Classifier & Tracker Web App)

This project is a full-stack web application that allows users to upload a facial skin image and receive an AI-generated acne classification. The app also includes an acne tracking section where users can log daily lifestyle and skincare information such as food intake, sleep, workout-to-shower timing, and skincare products.

The main goal of this project was to combine machine learning, web development, and user-focused design into one complete application. I created the acne classification model myself, trained it on a custom image dataset, built the backend API to serve predictions, and designed the frontend interface for users to interact with the model.

---

## Technologies Used

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* React Calendar

The frontend was built with React and Vite. React was used to create a responsive, component-based user interface, while Vite provided a fast development environment and simple project setup.

The frontend handles:

* Image uploads
* Image previews
* Drag-and-drop upload support
* Displaying predictions and confidence scores
* Opening informational popups
* Calendar-based acne tracking
* Local user interaction and state management

---

### Backend

* Python
* Flask
* Flask-CORS
* TensorFlow
* NumPy
* Pillow

The backend was built with Flask and connects the React frontend to the machine learning model. It receives uploaded images, validates them, preprocesses them, runs the trained model, and returns the prediction result as JSON.

The backend handles:

* Receiving uploaded images from the frontend
* Validating allowed file types
* Preprocessing images
* Loading the trained TensorFlow model
* Running model predictions
* Returning prediction results and confidence scores

---

### Machine Learning / Data Science

* TensorFlow
* Keras
* MobileNetV2
* NumPy
* Pandas
* Matplotlib
* Scikit-learn
* Pillow

These tools were used for dataset preparation, image preprocessing, model training, evaluation, and saving the final trained model.

The machine learning portion of this project included:

* Manual dataset collection
* Image cleaning and preprocessing
* Train/validation/test splitting
* Baseline model testing
* Custom CNN experimentation
* Transfer learning with MobileNetV2
* Model evaluation using accuracy, precision, recall, F1-score, and confusion matrices

---

## Project Overview

This application includes two main features:

### 1. AI Acne Classifier

Users can upload an image of acne or facial skin. The image is sent from the React frontend to the Flask backend, where it is preprocessed and passed into a trained TensorFlow model.

The model returns:

* Predicted acne class
* Confidence score

The frontend then displays the result in a clean and simple interface.

### 2. Acne Tracker

Users can select a date from a calendar and log daily information that may relate to acne breakouts.

The tracker currently supports:

* Food intake
* Workout time to shower time
* Sleep
* Skincare products used

The tracker is designed to help users reflect on daily habits and notice possible patterns in their skin over time.

---

## AI / Machine Learning Model

The acne classification model used in this project was created entirely by me.

I built the dataset, cleaned and processed the images, trained multiple models, evaluated the results, and selected the final model used in the application. This was not a pre-built acne classifier or an external acne detection API. The model was trained specifically for this project.

### Model Details

The final model uses transfer learning with MobileNetV2, a lightweight convolutional neural network architecture commonly used for image classification tasks.

I used MobileNetV2 as the base model and trained it on my own custom acne image dataset. The model was trained to classify images into the following acne-related categories:

* Inflammatory acne
* Comedonal open acne
* Comedonal closed acne
* Acne scars

The final trained model is saved as:

```txt
mobilenetv2_acne_classifier.keras
```

The class labels are stored separately in:

```txt
class_names.json
```

---

## Machine Learning Workflow

Before integrating the model into the web app, I went through a complete machine learning workflow.

### 1. Dataset Collection

I manually collected acne images for each class. The dataset was built specifically for this project and organized by acne type.

The final dataset focused on four classes:

* Inflammatory acne
* Comedonal open acne
* Comedonal closed acne
* Acne scars

I removed classes that were inconsistent or did not have enough reliable image examples. This helped improve the quality of the final model and made the classification task more focused.

---

### 2. Image Preprocessing

Each image was preprocessed before training. The preprocessing steps included:

* Opening images with Pillow
* Converting images to RGB
* Resizing images to `224x224`
* Normalizing pixel values to the range `[0, 1]`
* Preparing image arrays for TensorFlow model training

For the backend prediction pipeline, uploaded images go through the same type of preprocessing before being passed into the trained model.

---

### 3. Baseline Model

I first created a traditional machine learning baseline model using flattened image data. This gave me a starting point for comparison, but the results were limited because traditional machine learning models do not capture image patterns as well as convolutional neural networks.

---

### 4. Custom CNN

After the baseline model, I trained a small convolutional neural network from scratch. This performed better than the baseline model, but the dataset size was still relatively small, so the model had limitations.

---

### 5. Transfer Learning with MobileNetV2

The best results came from using transfer learning with MobileNetV2.

Since MobileNetV2 was already trained on a large image dataset, it could recognize useful visual features such as edges, textures, and shapes. I then adapted it to my acne classification problem by training it on my custom dataset.

This approach helped improve performance compared to the baseline model and the custom CNN.

---

### 6. Model Evaluation

I evaluated the model using training, validation, and test data.

I used metrics such as:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix

These metrics helped me understand which acne classes the model predicted well and which classes were more difficult.

---

## Main Features

### Image Upload and Preview

Users can upload an image through the frontend. After selecting an image, the app displays a preview before the prediction is made.

This improves the user experience by letting the user confirm that they selected the correct image.

---

### AI Acne Prediction

After the user uploads an image, the frontend sends the file to the Flask backend. The backend preprocesses the image and sends it into the trained TensorFlow model.

The app then displays:

* Predicted acne type
* Confidence score

---

### Acne Tracker

The acne tracker allows users to record daily information that may relate to skin changes or breakouts.

The tracker includes sections for:

* Food intake
* Workout time to shower time
* Sleep
* Skincare products used

The purpose of this feature is to help users reflect on possible lifestyle or skincare patterns that could relate to acne flare-ups.

---

### Calendar-Based Logging

The tracker uses a calendar interface so users can select a specific date and view or update logs for that day.

This makes the tracker more organized and easier to use compared to a single long list of entries.

---

### Educational Popups

The app includes popup sections that explain:

* What the acne classifier does
* What acne is
* What the different acne classes mean
* How the tracker can be used

These sections make the app more beginner-friendly and provide helpful context for users.

---

## How the App Works

### Prediction Flow

```txt
User uploads image
        ↓
React frontend sends image to Flask backend
        ↓
Flask validates and preprocesses the image
        ↓
TensorFlow model makes a prediction
        ↓
Backend returns prediction and confidence score
        ↓
Frontend displays the result
```

---

## Backend API

### POST `/predict`

This endpoint receives an uploaded image and returns the model prediction.

Example response:

```json
{
  "prediction": "inflammatory_acne",
  "confidence": 87.42
}
```

The confidence value represents how confident the model is in its predicted class.

---

## Project Structure

A simplified version of the project structure looks like this:

```txt
project-root/
│
├── backend/
│   ├── app.py
│   ├── predict.py
│   ├── model/
│   │   ├── mobilenetv2_acne_classifier.keras
│   │   └── class_names.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── components/
│   │       ├── AcneTracker.jsx
│   │       └── AcneTracker.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Running the Project Locally

### Backend Setup

Navigate into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

On Windows:

```bash
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask backend:

```bash
python app.py
```

The backend should now be running locally.

---

### Frontend Setup

Open a separate terminal and navigate into the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Run the React development server:

```bash
npm run dev
```

The frontend should now be available in the browser.

---

## Skills Demonstrated

This project demonstrates experience with:

* Full-stack web development
* React frontend development
* Flask backend development
* REST API design
* Image upload handling
* Machine learning model training
* Transfer learning
* TensorFlow/Keras model deployment
* Image preprocessing
* Data cleaning and dataset preparation
* Model evaluation
* UI/UX design
* Component-based frontend architecture
* Local state management
* Connecting a frontend application to a Python backend
* Building an end-to-end machine learning web application

---

## Why I Built This Project

I built this project to apply machine learning to a real-world problem while also creating a complete web application around the model.

Instead of only training a model in a notebook, I wanted to turn the model into something interactive that a user could actually use. This helped me practice not only machine learning, but also backend development, frontend development, API integration, and application design.

This project also helped me understand the full process of turning a machine learning idea into a usable application, from collecting data and training the model to building an interface and connecting it to a backend API.

---

## Current Status

The main functionality of the project is complete.

Completed features include:

* Custom-trained acne classification model
* Flask backend prediction API
* React frontend interface
* Image upload and preview
* Prediction and confidence display
* Acne tracker
* Calendar-based logging
* Informational popups

The next step is deploying the frontend through Vercel and preparing the backend for hosting.

---

## Future Improvements

Future improvements could include:

* Adding user accounts
* Saving tracker logs to a database such as Supabase
* Adding charts or analytics for breakout patterns
* Improving the model with a larger dataset
* Adding more acne categories
* Improving confidence calibration
* Creating a feedback system to help improve the model

---

## Disclaimer

This project is for educational and informational purposes only. It is not a medical diagnosis tool. Acne and skin conditions should be assessed by a qualified healthcare professional or dermatologist.
