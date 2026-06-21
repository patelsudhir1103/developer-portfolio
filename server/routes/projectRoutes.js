import express from "express";
import Project from "../models/Project.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Mock fallback projects for when DB is empty/offline
let mockProjects = [
  {
    _id: "fs-1",
    title: "Task Manager App",
    category: "Full-Stack Development",
    description: "A collaborative productivity dashboard to create, assign, and track tasks with status updates.",
    image: "card1",
    link: "#!",
    problemSolved: "Solved team coordination friction and missed deadlines by organizing milestones on an interactive task board.",
    features: [
      "JWT-based user registration & authorization",
      "Dynamic task creation, assignment, and status updates (CRUD)",
      "Interactive progress charts tracking completed milestones",
      "Search, filter, and sort tasks by priority or status"
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    githubLink: "https://github.com/patel-sudhir/task-manager",
    liveLink: "https://taskmanager-sudhir.netlify.app"
  },
  {
    _id: "fs-2",
    title: "E-Commerce Website",
    category: "Full-Stack Development",
    description: "A modern shopping experience featuring interactive product grids, category filtering, and shopping cart operations.",
    image: "card2",
    link: "#!",
    problemSolved: "Provides standard client-to-merchant transaction channels, streamlining checkout calculations and product display feeds.",
    features: [
      "Product catalog with keyword search and category filtering",
      "Sleek shopping cart storage with auto price calculations",
      "Admin login console for managing inventory levels",
      "Responsive checkout screen suitable for desktop or mobile"
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    githubLink: "https://github.com/patel-sudhir/ecommerce-store",
    liveLink: "https://ecommerce-sudhir.netlify.app"
  },
  {
    _id: "fs-3",
    title: "Student Management System",
    category: "Full-Stack Development",
    description: "A administrative record system to enroll students, update grades, and calculate averages.",
    image: "card3",
    link: "#!",
    problemSolved: "Replaced spreadsheet grading databases with a secure, centralized web dashboard to avoid human entry errors.",
    features: [
      "Secure dashboard for faculty grading inputs",
      "Student profile tracking with course enrollments",
      "Automatic average GPA calculation engines",
      "Downloadable student records in CSV format"
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "CSS Grid"],
    githubLink: "https://github.com/patel-sudhir/student-records",
    liveLink: "https://studentadmin-sudhir.netlify.app"
  },
  {
    _id: "fs-4",
    title: "Blog Website",
    category: "Full-Stack Development",
    description: "An interactive content hub where authors write posts in markdown and readers submit comment threads.",
    image: "card4",
    link: "#!",
    problemSolved: "Allows creators to self-publish their ideas online directly, with built-in engagement sections to build communities.",
    features: [
      "Rich text/markdown post editor for authors",
      "Real-time comments system on every post",
      "User profile verification checks",
      "Reading time estimation counters"
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "DaisyUI"],
    githubLink: "https://github.com/patel-sudhir/content-blog",
    liveLink: "https://blog-sudhir.netlify.app"
  },
  {
    _id: "fs-5",
    title: "Authentication System",
    category: "Full-Stack Development",
    description: "A secure template login portal using JWT cookie storage, password hashing, and reset flows.",
    image: "card5",
    link: "#!",
    problemSolved: "Provides a reusable, highly secure template for other projects to secure endpoints and user credentials.",
    features: [
      "Secure JWT cookie authentication storage",
      "Bcrypt password hashing encryption",
      "Email mock verification resets",
      "Protected user profile dashboards"
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    githubLink: "https://github.com/patel-sudhir/secure-auth-api",
    liveLink: "https://auth-sudhir.netlify.app"
  },
  {
    _id: "fs-6",
    title: "Portfolio Website",
    category: "Full-Stack Development",
    description: "This portfolio website featuring a dynamic admin dashboard, AI assistant chatbot, and database contacts store.",
    image: "card6",
    link: "#!",
    problemSolved: "Demonstrates full-stack engineering competency, server operations, and AI prompt integrations in a public resume.",
    features: [
      "Dynamic project content fetching and display states",
      "Interactive chatbot widget with LLM API capabilities",
      "Contact form inbox linked to active database",
      "Admin login console with CRUD project managers"
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    githubLink: "https://github.com/patel-sudhir/portfolio-fullstack",
    liveLink: "https://sudhir-portfolio.netlify.app"
  }
];

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.log("Database offline or empty, serving empty list for client fallback.");
    res.json(mockProjects);
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
router.post("/", protect, async (req, res) => {
  const { title, category, description, image, link, problemSolved, features, techStack, githubLink, liveLink } = req.body;

  if (!title || !category || !description || !image) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const project = new Project({
      title,
      category,
      description,
      image,
      link: link || "#!",
      problemSolved: problemSolved || "",
      features: features || [],
      techStack: techStack || [],
      githubLink: githubLink || "",
      liveLink: liveLink || "",
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.log("Database write failed, writing to fallback memory store.");
    const fallbackProject = {
      _id: `mock-${Date.now()}`,
      title,
      category,
      description,
      image,
      link: link || "#!",
      problemSolved: problemSolved || "",
      features: features || [],
      techStack: techStack || [],
      githubLink: githubLink || "",
      liveLink: liveLink || "",
      createdAt: new Date(),
    };
    mockProjects.unshift(fallbackProject);
    res.status(201).json(fallbackProject);
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  const { title, category, description, image, link, problemSolved, features, techStack, githubLink, liveLink } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.category = category || project.category;
      project.description = description || project.description;
      project.image = image || project.image;
      project.link = link || project.link;
      project.problemSolved = problemSolved !== undefined ? problemSolved : project.problemSolved;
      project.features = features !== undefined ? features : project.features;
      project.techStack = techStack !== undefined ? techStack : project.techStack;
      project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
      project.liveLink = liveLink !== undefined ? liveLink : project.liveLink;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    // Attempt fallback array update
    const index = mockProjects.findIndex((p) => p._id === req.params.id);
    if (index !== -1) {
      mockProjects[index] = {
        ...mockProjects[index],
        title: title || mockProjects[index].title,
        category: category || mockProjects[index].category,
        description: description || mockProjects[index].description,
        image: image || mockProjects[index].image,
        link: link || mockProjects[index].link,
        problemSolved: problemSolved !== undefined ? problemSolved : mockProjects[index].problemSolved,
        features: features !== undefined ? features : mockProjects[index].features,
        techStack: techStack !== undefined ? techStack : mockProjects[index].techStack,
        githubLink: githubLink !== undefined ? githubLink : mockProjects[index].githubLink,
        liveLink: liveLink !== undefined ? liveLink : mockProjects[index].liveLink,
      };
      return res.json(mockProjects[index]);
    }
    res.status(550).json({ message: "Error updating project", error: error.message });
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: "Project removed successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    // Attempt fallback array delete
    const index = mockProjects.findIndex((p) => p._id === req.params.id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
      return res.json({ message: "Fallback project removed successfully" });
    }
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
});

export { router as projectRoutes };
