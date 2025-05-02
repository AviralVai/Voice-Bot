const fs = require("fs");
const Tesseract = require("tesseract.js");
const axios = require("axios");

const solveImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;

    // Use Tesseract.js for OCR
    const {
      data: { text: rawText },
    } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    });
    const extractedText = rawText.trim();

    // Example dynamic prompt:
    const refinedPrompt = `
        You are a math tutor. A student has uploaded an image containing one or more math equations or questions. The OCR extracted the following text:
        "${extractedText}"

        Please analyze the text and follow these steps:
        1. Identify all the equations or problems present.
        2. Choose one equation or problem that is clearly defined.
        3. Provide a detailed, step-by-step solution to the chosen problem, making sure each step is on a new line.
        4. Use clear and simple language so that students can easily follow the solution.
        5. Do not include any unnecessary commentary; only show the explanation for solving the problem.

        Return your answer in plain text.
        `;

    console.log(refinedPrompt);

    // Call OpenAI API with the refined prompt
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "o3-mini", // Ensure your model supports math solving
        messages: [{ role: "user", content: refinedPrompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const solution = openaiResponse.data.choices[0].message.content;

    res.json({
      extractedText,
      solution,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res
      .status(500)
      .json({ error: "Failed to process image OCR or solve the problem." });
  }
};

module.exports = { solveImage };
