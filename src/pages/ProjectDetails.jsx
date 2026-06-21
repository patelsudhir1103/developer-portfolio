import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faExternalLinkAlt, faTasks, faGraduationCap, faBookOpen, faShoppingBag, faShieldAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import card1 from "../assets/images/portfolio-images/card-1.png";
import card2 from "../assets/images/portfolio-images/card-2.png";
import card3 from "../assets/images/portfolio-images/card-3.png";
import card4 from "../assets/images/portfolio-images/card-4.png";
import card5 from "../assets/images/portfolio-images/card-5.png";
import card6 from "../assets/images/portfolio-images/card-6.png";

const fallbackCards = [card1, card2, card3, card4, card5, card6];

const localFallbackProjects = [
  {
    _id: "fs-1",
    title: "Task Manager App",
    category: "Full-Stack Development",
    description: "A collaborative productivity dashboard to create, assign, and track tasks with status updates.",
    image: "card1",
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

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const found = data.find((p) => p._id === id || p.id === id);
        if (found) {
          setProject(found);
        } else {
          // Fallback search local
          const fallbackFound = localFallbackProjects.find((p) => p._id === id || p.id === id);
          setProject(fallbackFound || null);
        }
      } catch (err) {
        console.warn("Details api error, searching fallback.");
        const fallbackFound = localFallbackProjects.find((p) => p._id === id || p.id === id);
        setProject(fallbackFound || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-picto-primary"></span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h2>
        <Link to="/" className="btn btn-primary text-white">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" /> Back to Home
        </Link>
      </div>
    );
  }

  // Fallback image checks
  const isFallbackImgNeeded = !project.image || project.image.startsWith("card") || (!project.image.startsWith("http") && !project.image.startsWith("/"));
  let displayImage = project.image;
  if (isFallbackImgNeeded) {
    // try to get index
    const fallbackIdx = parseInt(id?.replace("fs-", "")) - 1 || 0;
    displayImage = fallbackCards[fallbackIdx % fallbackCards.length];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="btn btn-ghost btn-sm gap-2 text-gray-650 dark:text-gray-300 hover:text-picto-primary mb-8 self-start">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Portfolio
        </Link>

        {/* Content Card container */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Cover image area */}
          <div className="aspect-[16/9] w-full bg-gray-150 dark:bg-gray-800 overflow-hidden relative">
            <img src={displayImage} className="w-full h-full object-cover" alt={project.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-10">
              <div>
                <span className="px-3.5 py-1 text-xs font-extrabold uppercase bg-picto-primary text-white rounded-full tracking-wider shadow">
                  {project.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white mt-3 leading-tight">{project.title}</h1>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            {/* Tech Badges */}
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Technologies Employed</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-3.5 py-1 text-sm font-semibold rounded-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-150 dark:border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview & Problem Solved Grid */}
            <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Project Overview</h2>
                <p className="text-sm text-gray-650 dark:text-gray-305 leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Problem Solved</h2>
                <p className="text-sm text-gray-650 dark:text-gray-305 leading-relaxed">
                  {project.problemSolved || "Provides modular web functionality focusing on structured layout logic and data-driven interactions."}
                </p>
              </div>
            </div>

            {/* Features Bullet details */}
            {project.features && project.features.length > 0 && (
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Specifications & Features</h2>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-650 dark:text-gray-305">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-picto-primary shrink-0 mt-2"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links and Action Controls */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex-1 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-2 cursor-pointer py-3"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-lg" />
                  Source Code Repository
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1 text-white gap-2 cursor-pointer py-3"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  Visit Live Deployment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
