import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, "resume.pdf");
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
});

// @desc    Download the resume
// @route   GET /api/resume/download
// @access  Public
router.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "../uploads/resume.pdf");

  if (fs.existsSync(filePath)) {
    res.download(filePath, "Patel_Sudhir_Resume.pdf");
  } else {
    // Generate a fallback clean HTML/Text response or create a dummy file so it doesn't crash
    console.log("Resume PDF file not found. Creating a beautiful dummy PDF placeholder.");
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    // Create simple mock text in file
    const dummyText = `
PATEL SUDHIR
Full Stack Developer
London, England | mymail@mail.com | 00-123 00000

EXPERIENCE & SUMMARY:
15+ Years of Experience in Designing and Developing dynamic, responsive web interfaces.
Completed over 250 projects with 58 happy clients worldwide.

TECHNICAL SKILLS:
- Frontend & Backend Engineering (React, Node.js, Express, MongoDB)
- Frontend Development (React, JavaScript, HTML, CSS)
- Frameworks & Styling (Tailwind CSS, DaisyUI, Bootstrap)
- Fullstack Stack (Node.js, Express, MongoDB, REST APIs)

This is an automatically generated Resume placeholder. 
To upload your official PDF resume, please log in to the admin panel.
    `;
    fs.writeFileSync(filePath, dummyText.trim());
    res.download(filePath, "Patel_Sudhir_Resume.pdf");
  }
});

// @desc    Upload the resume PDF
// @route   POST /api/resume/upload
// @access  Private
router.post("/upload", protect, upload.single("resume"), (req, res) => {
  res.json({ message: "Resume uploaded successfully" });
}, (error, req, res, next) => {
  res.status(400).json({ message: error.message });
});

export { router as resumeRoutes };
