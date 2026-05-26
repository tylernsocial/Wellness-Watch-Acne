import { useState } from 'react'; /* allows a component remember information*/
import './App.css';

function App() { /* creates a react element called App which is reusable piece of UI*/
  const [selectedImage, setSelectedImage] = useState(null); /* the current variable value, use SSI the function that can change that value into US(null) so start with no image selected*/

  function handleImageChange(event) { /* runs when the user pickers a file*/
    const file = event.target.files[0]; /* event contains information about what just happened, the line means get the first file the user selected*/

    if (file) {
      setSelectedImage(file);
    }
  }

  return ( /*everything inside return is what appears on the screen*/
    <div className="app">
      <h1>Acne Classifier</h1>
      <p>Upload an image to classify acne severity.</p>

      <div className="upload-box">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} /*when user selects a file run the function*/
        />
        
        {selectedImage && ( /*react conditional this says if SI exits then show this paragraph*/
          <p>Selected file: {selectedImage.name}</p>
        )}

        <button>Classify Image</button>
      </div>
    </div>
  );
}

export default App; /*this allows another file usually main.jsx to import and display the App component, so App.jsx defines the page, and main.jsx actually puts it onto the website*/