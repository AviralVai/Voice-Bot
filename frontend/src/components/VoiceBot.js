import React, { useState } from "react";
import axios from "axios";
import "./VoiceBot.css"; // Import the CSS file for styling

const VoiceBot = () => {
    const [message, setMessage] = useState(""); // State to hold the user's input
    const [reply, setReply] = useState(""); // State to hold the bot's reply
    const [isListening, setIsListening] = useState(false); // State to track if speech recognition is active

    // Text-to-Speech Function
    const speak = (text) => {
        if (!window.speechSynthesis) {
            console.error("Text-to-Speech is not supported in this browser.");
            alert("Text-to-Speech is not supported in this browser.");
            return;
        }

        console.log("Speaking:", text); // Debug log
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US"; // Set language to English
        utterance.rate = 1; // Set speaking rate (1 is normal speed)
        utterance.pitch = 1; // Set pitch (1 is default)

        synth.speak(utterance);

        // Stop speaking if "stop" is detected
        utterance.onend = () => {
            console.log("Speech finished.");
        };
    };

    // Stop Text-to-Speech
    const stopSpeaking = () => {
        if (window.speechSynthesis.speaking) {
            console.log("Stopping speech...");
            window.speechSynthesis.cancel(); // Stop any ongoing speech
        }
    };

    // Handle Speech-to-Text
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US"; // Set the language
        recognition.interimResults = false; // Only return final results
        recognition.onstart = () => {
            setIsListening(true);
            console.log("Voice recognition started...");
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log("Voice input:", transcript);

            // If the user says "stop," stop speaking
            if (transcript === "stop") {
                stopSpeaking();
                recognition.stop(); // Stop listening
                setIsListening(false);
                return;
            }

            setMessage(transcript); // Set the recognized text as the message
            handleSend(transcript); // Automatically send the message
        };
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };
        recognition.onend = () => {
            setIsListening(false);
            console.log("Voice recognition ended.");
        };

        recognition.start(); // Start voice recognition
    };

    // Handle Text Input Submission
    const handleSend = async (inputMessage = message) => {
        if (!inputMessage.trim()) {
            console.error("Message is empty or undefined");
            return;
        }

        try {
            console.log("Sending message:", inputMessage); // Debug log
            const response = await axios.post("http://localhost:5000/api/chat", { message: inputMessage });
            console.log("Bot reply:", response.data.reply); // Debug log
            setReply(response.data.reply); // Update the reply state with the bot's response
            speak(response.data.reply); // Speak the response
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
        }
    };

    return (
        <div className="voice-bot-container">
            <h1 className="title">Voice Bot</h1>
            <div className="chat-box">
                <div className="input-container">
                    <button
                        className={`speak-button ${isListening ? "listening" : ""}`}
                        onClick={handleVoiceInput}
                        disabled={isListening}
                    >
                        {isListening ? "Listening..." : "🎤 Speak"}
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message or use voice input"
                        className="message-input"
                    />
                    <button
                        className="send-button"
                        onClick={() => handleSend()}
                        disabled={!message.trim()}
                    >
                        Send
                    </button>
                    <button
                        className="stop-button"
                        onClick={stopSpeaking}
                        style={{ marginLeft: "10px" }}
                    >
                        Stop
                    </button>
                </div>
                {reply && (
                    <div className="reply-container">
                        <p className="bot-reply">{reply}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceBot;
