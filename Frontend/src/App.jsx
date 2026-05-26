import './App.css'

import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Acne Classifier</h1>
      <p>Upload an image to classify acne severity.</p>

      <div className="upload-box">
        <input type="file" accept="image/*" />
        <button>Classify Image</button>
      </div>
    </div>
  );
}

export default App;