import React, { useState } from "react";
import axios from "axios";

const ImageSolver = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image file");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/solve-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Image to Solve Question</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Solve</button>
      {result && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Extracted Text:</strong> {result.extractedText}</p>
          <p><strong>Solution:</strong> {result.solution}</p>
          <p>
            <strong>Learn More:</strong>{" "}
            <a href={result.youtubeLink} target="_blank" rel="noopener noreferrer">
              YouTube Search
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageSolver;