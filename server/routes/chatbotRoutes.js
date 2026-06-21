import express from "express";

const router = express.Router();

// Fallback rules system for offline / no-API-key mode
const getLocalBotResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();

  // Intro
  if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey") || msg.includes("greetings")) {
    return "Hello! I am Sudhir's AI Assistant. How can I help you today? I can answer questions about Sudhir's skills, projects, experience, or work availability!";
  }
  
  // Experience / years
  if (msg.includes("experience") || msg.includes("how long") || msg.includes("years")) {
    return "Patel Sudhir has over 15 years of professional experience in freelance Full Stack Development and Software Engineering. He has completed over 250 projects for 58 happy clients.";
  }

  // Skills
  if (msg.includes("skill") || msg.includes("technolog") || msg.includes("stack") || msg.includes("what can you do") || msg.includes("language")) {
    return "Sudhir specializes in Full Stack Web Development, including Node.js backend engineering, React.js frontend development, API creation, database management, and responsive admin dashboard design. He works with JavaScript, React 19, Vite, Express, and MongoDB.";
  }

  // Projects
  if (msg.includes("project") || msg.includes("work") || msg.includes("portfolio")) {
    return "Sudhir has designed and developed numerous web applications, including Product Admin Dashboards, client landing pages, and interactive interfaces. You can view his featured works under the 'Portfolio' section of this page! We also have a Project Manager in the admin section where projects can be added dynamically.";
  }

  // Location
  if (msg.includes("where") || msg.includes("location") || msg.includes("live") || msg.includes("london") || msg.includes("england")) {
    return "Sudhir is a freelance designer and developer based in London, England, and is available for remote work globally.";
  }

  // Contact / email / hire
  if (msg.includes("contact") || msg.includes("email") || msg.includes("hire") || msg.includes("job") || msg.includes("work together") || msg.includes("phone")) {
    return "You can get in touch with Sudhir by filling out the Contact Form on the website, emailing him directly at mymail@mail.com, or calling him at 00-123 00000. He is currently open to freelance design and development opportunities!";
  }

  // Resume
  if (msg.includes("resume") || msg.includes("cv") || msg.includes("download")) {
    return "You can download Sudhir's professional CV/Resume directly from the hero section of the portfolio or by clicking the resume download link in the navbar.";
  }

  // Default response
  return "That's an interesting question! As Sudhir's AI assistant, I can tell you that he focuses on crafting immersive, beautiful, and user-centric web applications. For details on that specific topic, feel free to drop him a message using the Contact Form below, or email him at mymail@mail.com!";
};

// @desc    Get AI chatbot response
// @route   POST /api/chatbot
// @access  Public
router.post("/", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return intelligent local response
    console.log("No GEMINI_API_KEY set, using local assistant fallback.");
    const reply = getLocalBotResponse(message);
    // Simulate slight typing delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return res.json({ reply });
  }

  try {
    // System instruction to guide Gemini
    const systemPrompt = `You are the personal AI Assistant of Patel Sudhir, a professional freelance Full Stack Developer based in London, England. 
Sudhir's details:
- Experience: 15+ years
- Completed Projects: 250+
- Happy Clients: 58
- Email: mymail@mail.com
- Phone: 00-123 00000
- Tech Stack: React 19, Tailwind CSS v4, DaisyUI v5, Node.js, Express, MongoDB.
- Services: Full-stack development, custom web applications, responsive dashboard interfaces, REST APIs, and database solutions.
Instructions: Be concise, friendly, helpful, and speak as Sudhir's representative. Encourage the user to contact Sudhir or hire him.`;

    const chatHistory = history || [];
    const formattedContents = chatHistory.map(h => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    // Add current user prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.json({ reply });
    } else {
      console.warn("Invalid Gemini API response format, falling back.", data);
      return res.json({ reply: getLocalBotResponse(message) });
    }
  } catch (error) {
    console.error("Gemini chatbot error:", error);
    return res.json({ reply: getLocalBotResponse(message) });
  }
});

export { router as chatbotRoutes };
