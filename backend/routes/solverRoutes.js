const express = require("express");
const multer = require("multer");
const { solveImage } = require("../controllers/solverController");

const router = express.Router();

// Save uploaded images in the "uploads" folder
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), solveImage);

module.exports = router;