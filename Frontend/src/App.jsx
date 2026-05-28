import { useState, useRef } from 'react'; /* allows a component remember information*/
import './App.css';

function App() { /* creates a react element called App which is reusable piece of UI*/

  const [selectedImage, setSelectedImage] = useState(null); /* the current variable value, use SSI the function that can change that value into US(null) so start with no image selected (thing that will be sent to flask)*/
  const [previewUrl, setPreviewUrl] = useState(null); /* store a temp browser URL so react can display the image on the page */
  const [prediction, setPrediction] = useState(null); /* the model result from flask */
  const [loading, setLoading] = useState(false); /* whether the app is currently waiting for the backend */
  const [error, setError] = useState(null); /* stores and error message*/

  const fileInputRef = useRef(null); /* reference to the file input*/

  function handleImageChange(event) { /* runs when the user pickers a file*/
    const file = event.target.files[0]; /* event contains information about what just happened, the line means get the first file the user selected*/

    if (!file) {
      return;
    }

    validateAndSetImage(file);
  }

  async function handleClassifyImage() { /* async, essentially means the fucntion will do something that takes time*/
    
    if (!selectedImage) { /* check if image exists*/
      setError("Please select an image first.");
      return;
    }

    /* turns loading on, prepares the UI before sending the image*/
    setLoading(true); /* means app is waiting for the backend*/
    setError(null); /* clears old errors*/
    setPrediction(null); /* clears old predictions*/

    /* packages the image so it can be sent to Flask */
    const formData = new FormData(); /* creates empty form package*/
    formData.append("image", selectedImage); /* adds image to the package*/

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", { /* sends request to flask, essentially fetch allows the frontend to talk to another server */
        method: "POST", /* send data to the backend, POST request is usually for sending information in this case an uploaded image*/
        body: formData, /* the actual data that is being send, this case the image*/
      });
      
      let data;

      try {
        data = await response.json(); /* waits for backend response and converts it into javascript data */
      } catch {
        data = { error: "Something went wrong. The server did not return a valid response." };
      }
      
      if (!response.ok) { /* backend sends a response with a status code, 200 is success, 400 bad request, 404 route not found, 500 backend server error*/
        throw new Error(data.error || "Something went wrong with the prediction.");
      }

      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* function that formats the json string*/
  function formatPrediction(label) {
    if (!label) {
      return "";
    }

    return label
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /* clears all the states*/
  function clearImage() {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; /* clears the actual file input box */
    }
  }

  /* validates the selected file and creates the image preview */
  function validateAndSetImage(file) {
    if (!file.type.startsWith("image/")) {
      setSelectedImage(null);
      setPreviewUrl(null);
      setPrediction(null);
      setError("Invalid file type. Please upload an image file.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file); /* takes the file and creates a temp url for it so that react can also use it inside an image tag */
    setPreviewUrl(imageUrl);

    setPrediction(null);
    setError(null);
  }

  /* runs when the user drops a file into the upload area */
  function handleDrop(event) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (!file) {
      return;
    }

    validateAndSetImage(file);
  }

  /* allows the browser to accept dropped files */
  function handleDragOver(event) {
    event.preventDefault();
  }

  return ( /* everything inside return is what appears on the screen */
    <div className="app">

      {/* floating top navbar */}
      <nav className="navbar">
        <div className="logo"> (insert logo) WW-Acne </div>

        <div className="nav-links">
          <span>About</span>
        </div>

        <button className="nav-button">Help Improve The Model!</button>
      </nav>

      {/* main two-column layout */}
      <main className="main-card">

        {/* left side: working classifier */}
        <section className="classifier-panel">
          <div className="panel-header">
            <p className="eyebrow">AI Skin Analysis</p>
            <h1>Acne Classifier</h1>
            <p className="panel-description">
              Upload an image to classify acne severity using your trained model.
            </p>
          </div>

          <div 
            className="upload-box"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="drop-text">Drag and drop an image here, or choose a file</p>

            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange} /* when user selects a file run the function */
            />
            
            {selectedImage && ( /* react conditional this says if SI exits then show this paragraph */
              <p className="file-name">Selected file: {selectedImage.name}</p>
            )}

            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Selected preview" 
                className="preview-image"
              />
            )}

            <button onClick={handleClassifyImage} disabled={loading}> {/* when the button is clicked, run the function, if loading is true, disable the button, and show classifying, otherwise show classify image */}
              {loading ? "Classifying..." : "Classify Image"}
            </button>

            {selectedImage && (
              <button type="button" onClick={clearImage} className="clear-button">
                Clear Image
              </button>
            )}

            {error && (
              <p className="error">{error}</p>
            )}

            {prediction && (
              <div className="result-box">
                <h2>Prediction Result</h2>

                <p>
                  <strong>Prediction:</strong>{" "}
                  {formatPrediction(prediction.prediction)}
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  {Number(prediction.confidence).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </section>

        {/* right side: future acne tracker preview */}
        <section className="tracker-panel">
          <div className="tracker-content">
            <p className="eyebrow">Coming Soon</p>
            <h2>Acne Tracker</h2>

            <p className="tracker-description">
              In the future, this section can help users track lifestyle habits and skin progress over time.
            </p>

            <div className="tracker-preview-card large-preview">
              <span>Progress Overview</span>
              <strong>Weekly skin check-ins</strong>
              <p>Compare acne changes across days, weeks, and routines.</p>
            </div>

            <div className="tracker-list">
              <div className="tracker-preview-card">
                <span>Food Logs</span>
                <p>Track meals and possible triggers.</p>
              </div>

              <div className="tracker-preview-card">
                <span>Sleep</span>
                <p>Record sleep patterns and stress.</p>
              </div>

              <div className="tracker-preview-card">
                <span>Skincare</span>
                <p>Monitor products and routine changes.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App; /* this allows another file usually main.jsx to import and display the App component, so App.jsx defines the page, and main.jsx actually puts it onto the website */