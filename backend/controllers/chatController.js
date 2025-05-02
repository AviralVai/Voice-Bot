const axios = require("axios");
const stringSimilarity = require("string-similarity"); // Import string-similarity library

// Predefined responses
const predefinedResponses = {
    "what should we know about your life story in a few sentences": 
        "A naturally curious and ambitious individual, always eager to explore new ideas and push the boundaries of technology. Passionate about innovation, constantly seeking opportunities to create meaningful impact and drive positive change.",
    
    "what’s your #1 superpower": 
        "The ability to learn rapidly and adapt to any situation. Whether it’s mastering a new skill, solving complex problems, or navigating challenges, resilience and adaptability make anything possible.",
    
    "what are the top 3 areas you’d like to grow in": 
        "Public speaking to communicate ideas more effectively, coding to build smarter and more efficient solutions, and leadership to inspire and collaborate with teams in making a lasting impact.",
    
    "what misconception do your coworkers have about you": 
        "Some might assume quietness means shyness, but in reality, it’s a thoughtful and observant nature that focuses on understanding before speaking, ensuring meaningful contributions.",
    
    "how do you push your boundaries and limits": 
        "By embracing challenges, stepping outside comfort zones, and continuously learning from both successes and setbacks. Every obstacle is an opportunity for growth and improvement."
};

// Function to preprocess text (normalize input for better matching)
const preprocessText = (text) => {
    return text
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim(); // Trim leading and trailing spaces
};

// Function to find the best match for the user's input
const findBestMatch = (input) => {
    const questions = Object.keys(predefinedResponses).map(preprocessText); // Preprocess predefined questions
    const processedInput = preprocessText(input); // Preprocess user input
    const bestMatch = stringSimilarity.findBestMatch(processedInput, questions);
    if (bestMatch.bestMatch.rating > 0.8) { // Threshold for similarity
        const originalQuestion = Object.keys(predefinedResponses)[bestMatch.bestMatchIndex]; // Get the original question
        return originalQuestion;
    }
    return null;
};

exports.chatWithBot = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    // Find the best match for the user's input
    const bestMatch = findBestMatch(message);

    // If a predefined response matches, return it
    if (bestMatch) {
        return res.json({ reply: predefinedResponses[bestMatch] });
    }

    // If no predefined response, use OpenAI API
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "o3-mini",
                messages: [{ role: "user", content: message }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error in /api/chat:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.response?.data || error.message });
    }
};
