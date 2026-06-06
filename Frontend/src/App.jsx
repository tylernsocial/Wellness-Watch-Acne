import { useState, useRef } from 'react'; /* allows a component remember information*/
import './App.css';
import AcneTracker from './AcneTracker.jsx';
import aiAvatarSide from './assets/ai-avatar-side.png';
import trackerAvatarFront from './assets/tracker-avatar-front.png';

function App() { /* creates a react element called App which is reusable piece of UI*/

  const [selectedImage, setSelectedImage] = useState(null); /* the current variable value, use SSI the function that can change that value into US(null) so start with no image selected (thing that will be sent to flask)*/
  const [previewUrl, setPreviewUrl] = useState(null); /* store a temp browser URL so react can display the image on the page */
  const [prediction, setPrediction] = useState(null); /* the model result from flask */
  const [loading, setLoading] = useState(false); /* whether the app is currently waiting for the backend */
  const [error, setError] = useState(null); /* stores and error message*/

  const [openPopup, setOpenPopup] = useState(null); /* stores which popup is open right now.
  null means no popup is open.
  "about" means the About popup is open.
  "learnAcne" means the Learn Acne popup is open. */

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

  /* gets the explanation for the prediction label */
  function getAcneInfo(label) {
    return acneInfo[label] || {
      title: formatPrediction(label),
      description:
        "This prediction label does not have a detailed explanation yet.",
      details: [
        "You can add a custom explanation for this class later."
      ]
    };
  }

  /* explanation content for each acne class */
  const acneInfo = {
    comedonal_open: {
      title: "Open Comedonal Acne",
      description:
        "Open comedonal acne usually refers to blackheads. These happen when pores become clogged with oil and dead skin cells, but the pore remains open at the surface.",
      details: [
        "Commonly appears as small dark spots or bumps.",
        "Usually considered non-inflammatory acne.",
        "Often linked to clogged pores rather than red swollen bumps."
      ]
    },

    comedonal_closed: {
      title: "Closed Comedonal Acne",
      description:
        "Closed comedonal acne usually refers to whiteheads. These happen when pores become clogged with oil and dead skin cells while the pore stays closed at the surface.",
      details: [
        "Commonly appears as small flesh-colored or white bumps.",
        "Usually considered non-inflammatory acne.",
        "Can sometimes develop into inflamed pimples."
      ]
    },

    inflammatory_acne: {
      title: "Inflammatory Acne",
      description:
        "Inflammatory acne includes red, swollen, or tender acne lesions. This can include papules, pustules, nodules, and more severe cystic acne depending on the depth and severity.",
      details: [
        "Papules are small inflamed bumps without visible pus.",
        "Pustules are inflamed bumps that contain pus.",
        "Nodules and cystic acne are deeper, more painful forms that can sit under the skin and may increase the risk of scarring.",
        "Persistent, painful, or worsening inflammatory acne should be checked by a healthcare professional."
      ]
    },

    acne_scars: {
      title: "Acne Scars",
      description:
        "Acne scars are marks or texture changes left behind after acne has healed. They can appear as dark spots, discoloration, indents, or raised areas depending on the skin response.",
      details: [
        "Post-acne marks may look red, brown, or darker than the surrounding skin.",
        "Indented scars can appear as small pits or uneven texture.",
        "Raised scars can form when the skin produces extra tissue during healing.",
        "Scars and dark marks can take time to fade, and persistent scarring may benefit from professional treatment."
      ]
    }
  };

  return ( /* everything inside return is what appears on the screen */
    <div className="app">
      <div className="avatar-backdrop" aria-hidden="true">
        <img
          src={aiAvatarSide}
          alt=""
          className="avatar-image avatar-image-left"
        />

        <img
          src={trackerAvatarFront}
          alt=""
          className="avatar-image avatar-image-right"
        />

      </div>

      {/* floating top navbar */}
      <nav className="navbar">
        <div className="logo">Wellness Watch Acne</div>

        <div className="nav-links">
          <button
            className="nav-link-button"
            onClick={() => setOpenPopup("about")} /* opens the About popup */
          >
            About
          </button>

          <button
            className="nav-link-button"
            onClick={() => setOpenPopup("learnAcne")} /* opens the Learn Acne popup */
          >
            Learn Acne
          </button>
        </div>

        <button
          className="nav-button"
          onClick={() => alert("Model contribution form coming soon!")}
        >
          Help Improve The Model
        </button>
      </nav>

      {/* main dashboard layout: classifier on the left and tracker on the right */}
      <main className="main-card">

        {/* left side: working classifier */}
        <section className="classifier-panel" id="classifier">
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
            {/* left side of the classifier card: upload controls */}
            <div className="upload-controls">
              <p className="drop-text">
                Drag and drop an image here, or choose a file
              </p>

              <label className="classifier-file-picker">
                <span className="classifier-file-button">Choose File</span>
                <span className="classifier-file-text">
                  {selectedImage ? selectedImage.name : "No file selected"}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange} /* when user selects a file run the function */
                />
              </label>

              {selectedImage && ( /* react conditional this says if SI exits then show this paragraph */
                <p className="file-name">Selected file: {selectedImage.name}</p>
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
            </div>

            {/* right side of the classifier card: image preview and prediction summary */}
            <div className="preview-result-area">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="preview-image"
                />
              ) : (
                <div className="empty-preview">
                  <p>No image selected</p>
                </div>
              )}

              {/* this box only shows the prediction and confidence */}
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

            {/* this box spans across the bottom and explains the prediction */}
            {prediction && (
              <div className="acne-info-box">
                <h3>{getAcneInfo(prediction.prediction).title}</h3>

                <p>{getAcneInfo(prediction.prediction).description}</p>

                <ul>
                  {getAcneInfo(prediction.prediction).details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>

                <p className="medical-note">
                  This is not a medical diagnosis. For painful, worsening, or persistent acne, consider speaking with a healthcare professional.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* right side: acne tracker component */}
        <AcneTracker />

      </main>

      {/* popup card that opens when the About or Learn Acne navbar buttons are clicked */}
      {openPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button
              className="popup-close-button"
              onClick={() => setOpenPopup(null)} /* closes whatever popup is currently open */
            >
              x
            </button>

            {openPopup === "about" && (
              <div>
                <p className="eyebrow">About</p>
                <h2>About WWA</h2>

                <p>
                  WWA stands for Wellness Watch Acne. It is an all-in-one acne
                  classification and tracking tool designed to help users better
                  understand their skin.
                </p>

                <p>
                  The classifier allows users to upload a face or skin image and
                  receive an AI-generated acne classification. It also helps users
                  learn more about different acne types and what the results may mean.
                </p>

                <p>
                  The tracker section helps users identify possible breakout patterns
                  by tracking calendar dates, food intake, workout and shower timing,
                  sleep, skincare products, stress, notes, skin images, and progress
                  over time.
                </p>

                <p className="popup-note">
                  This tool is for learning and tracking support only. It is not a
                  medical diagnosis.
                </p>
              </div>
            )}

            {openPopup === "learnAcne" && (
              <div>
                <p className="eyebrow">Learn Acne</p>
                <h2>Acne Types</h2>

                <div className="learn-acne-grid">
                  {Object.entries(acneInfo).map(([key, info]) => (
                    <div className="learn-acne-card" key={key}>
                      <h3>{info.title}</h3>
                      <p>{info.description}</p>

                      <ul>
                        {info.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <p className="popup-note">
                  These descriptions are for general learning only. Acne can vary by
                  person, and persistent or painful acne should be discussed with a
                  healthcare professional.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App; /* this allows another file usually main.jsx to import and display the App component, so App.jsx defines the page, and main.jsx actually puts it onto the website */

