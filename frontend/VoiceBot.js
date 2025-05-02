import React, { useState, useEffect } from "react";

const VoiceBot = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [isListening, setIsListening] = useState(false);

    // Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    // Text-to-Speech Function
    const speak = (text) => {
        if (!window.speechSynthesis) {
            alert("Text-to-Speech is not supported in this browser.");
            return;
        }

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US"; // Set language to English
        utterance.rate = 1; // Set speaking rate (1 is normal speed)
        utterance.pitch = 1; // Set pitch (1 is default)

        synth.speak(utterance);
    };

    // Handle Speech-to-Text
    const startListening = () => {
        if (!recognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript); // Set the transcribed message
            handleSend(transcript); // Automatically send the message
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    };

    // Handle Text Input Submission
    const handleSend = async (inputMessage = message) => {
        if (!inputMessage.trim()) return;

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: inputMessage }),
            });

            const data = await res.json();
            setResponse(data.reply);
            speak(data.reply); // Speak the response
        } catch (error) {
            console.error("Error:", error);
        }

        setMessage(""); // Clear the input field
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Voice Bot</h1>
            <div>
                <textarea
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message or use the microphone..."
                    style={{ width: "100%", padding: "10px", fontSize: "16px" }}
                />
            </div>
            <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleSend()} style={{ padding: "10px 20px", marginRight: "10px" }}>
                    Send
                </button>
                <button onClick={startListening} style={{ padding: "10px 20px" }}>
                    {isListening ? "Listening..." : "Speak"}
                </button>
            </div>
            {response && (
                <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f1f1f1", borderRadius: "5px" }}>
                    <strong>Bot:</strong> {response}
                </div>
            )}
        </div>
    );
};

export default VoiceBot;