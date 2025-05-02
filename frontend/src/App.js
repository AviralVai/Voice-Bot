import React, { useState } from "react";
import VoiceBot from "./components/VoiceBot";
import ImageSolver from "./components/ImageSolver";

function App() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div>
      {/* <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <button onClick={() => setActiveTab("chat")}>Chat Bot</button>
                <button onClick={() => setActiveTab("image")}>Image Solver</button>
            </div> */}
      {activeTab === "chat" ? <VoiceBot /> : <ImageSolver />}
    </div>
  );
}

export default App;
