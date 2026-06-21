import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faTrash,
  faEdit,
  faEnvelope,
  faFilePdf,
  faUpload,
  faTachometerAlt,
  faFolder,
  faEnvelopeOpen,
  faSyncAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    projectsCount: 0,
    messagesCount: 0,
    unreadCount: 0,
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    id: null,
    title: "",
    category: "UI-UX Design",
    description: "",
    image: "",
    link: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [dashboardStatus, setDashboardStatus] = useState({ loading: true, message: null, error: null });

  const navigate = useNavigate();

  // Auth Guard & Load data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setDashboardStatus((prev) => ({ ...prev, loading: true, error: null }));
    const token = localStorage.getItem("token");

    try {
      // Fetch projects
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();

      // Fetch messages
      const msgRes = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msgData = await msgRes.json();

      const unread = Array.isArray(msgData) ? msgData.filter((m) => !m.isRead).length : 0;

      setProjects(Array.isArray(projData) ? projData : []);
      setMessages(Array.isArray(msgData) ? msgData : []);
      setStats({
        projectsCount: Array.isArray(projData) ? projData.length : 0,
        messagesCount: Array.isArray(msgData) ? msgData.length : 0,
        unreadCount: unread,
      });

      setDashboardStatus({ loading: false, message: null, error: null });
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setDashboardStatus({
        loading: false,
        message: null,
        error: "Failed to connect to backend API. Serving in offline testing mode.",
      });
    }
  };

  // Create or Update Project
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/projects/${projectForm.id}` : "/api/projects";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      if (!response.ok) throw new Error("Operation failed");

      // Reset form and reload
      setProjectForm({ id: null, title: "", category: "UI-UX Design", description: "", image: "", link: "" });
      setIsEditing(false);
      
      // Notify components to refresh
      window.dispatchEvent(new Event("refresh-projects"));
      
      setDashboardStatus((prev) => ({ ...prev, message: "Project saved successfully!" }));
      setTimeout(() => setDashboardStatus((prev) => ({ ...prev, message: null })), 3000);
      
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setDashboardStatus((prev) => ({ ...prev, error: "Project operations failed." }));
    }
  };

  // Edit project button click handler
  const startEditProject = (p) => {
    setProjectForm({
      id: p._id || p.id,
      title: p.title,
      category: p.category,
      description: p.description,
      image: p.image,
      link: p.link,
    });
    setIsEditing(true);
    setActiveTab("projects");
  };

  // Delete project handler
  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      // Notify portfolio to reload
      window.dispatchEvent(new Event("refresh-projects"));
      
      setDashboardStatus((prev) => ({ ...prev, message: "Project removed successfully!" }));
      setTimeout(() => setDashboardStatus((prev) => ({ ...prev, message: null })), 3000);
      
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setDashboardStatus((prev) => ({ ...prev, error: "Delete failed" }));
    }
  };

  // Mark Message as Read handler
  const markMessageAsRead = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Update failed");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Message handler
  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Resume PDF Upload handler
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setDashboardStatus((prev) => ({ ...prev, loading: true }));
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");

      setResumeFile(null);
      setDashboardStatus({ loading: false, message: "Resume uploaded successfully!", error: null });
      setTimeout(() => setDashboardStatus((prev) => ({ ...prev, message: null })), 4000);
    } catch (err) {
      console.error(err);
      setDashboardStatus({ loading: false, message: null, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage portfolio projects, read contact inquiries, and configure uploads.
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            className="btn btn-outline btn-sm gap-2 dark:text-white dark:border-gray-700 cursor-pointer self-start"
          >
            <FontAwesomeIcon icon={faSyncAlt} className="text-xs" />
            Refresh Data
          </button>
        </div>

        {/* Global Alert Notification Banner */}
        {dashboardStatus.message && (
          <div className="alert alert-success text-white mb-6 rounded-xl shadow p-4">
            <span>{dashboardStatus.message}</span>
          </div>
        )}

        {dashboardStatus.error && (
          <div className="alert alert-warning text-white mb-6 rounded-xl shadow p-4 bg-orange-500">
            <span>{dashboardStatus.error}</span>
          </div>
        )}

        {/* Tabs System Navigation */}
        <div className="tabs tabs-boxed mb-8 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`tab gap-2 flex-1 md:flex-initial py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-picto-primary text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850"
            }`}
          >
            <FontAwesomeIcon icon={faTachometerAlt} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`tab gap-2 flex-1 md:flex-initial py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "projects"
                ? "bg-picto-primary text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850"
            }`}
          >
            <FontAwesomeIcon icon={faFolder} />
            Projects ({stats.projectsCount})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`tab gap-2 flex-1 md:flex-initial py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "messages"
                ? "bg-picto-primary text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850"
            }`}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            Messages ({stats.unreadCount} Unread)
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`tab gap-2 flex-1 md:flex-initial py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-picto-primary text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850"
            }`}
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Resume PDF
          </button>
        </div>

        {/* Dynamic Panels */}
        {dashboardStatus.loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="loading loading-spinner loading-lg text-picto-primary"></span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* OVERVIEW PANEL */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Projects Stat Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
                      <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.projectsCount}</h3>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-xl">
                      <FontAwesomeIcon icon={faFolder} className="text-xl" />
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs font-semibold text-picto-primary hover:underline mt-4 block"
                  >
                    Manage projects &rarr;
                  </button>
                </div>

                {/* Messages Stat Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Messages</p>
                      <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.messagesCount}</h3>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl">
                      <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className="text-xs font-semibold text-picto-primary hover:underline mt-4 block"
                  >
                    View messages ({stats.unreadCount} unread) &rarr;
                  </button>
                </div>

                {/* System Settings Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resume PDF status</p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Configure File</h3>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl">
                      <FontAwesomeIcon icon={faFilePdf} className="text-xl" />
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="text-xs font-semibold text-picto-primary hover:underline mt-4 block"
                  >
                    Upload Resume &rarr;
                  </button>
                </div>

                {/* Recent Projects Table View */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm md:col-span-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Projects List</h3>
                  {projects.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No projects added yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table w-full text-left border-collapse text-gray-850 dark:text-gray-200">
                        <thead>
                          <tr className="border-b border-gray-250 dark:border-gray-800 text-sm font-semibold text-gray-500">
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Link</th>
                            <th className="py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.slice(0, 5).map((p) => (
                            <tr key={p._id || p.id} className="border-b border-gray-150 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850/50">
                              <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{p.title}</td>
                              <td className="py-3 px-4 text-xs font-semibold text-picto-primary">{p.category}</td>
                              <td className="py-3 px-4 text-xs text-gray-400">{p.link}</td>
                              <td className="py-3 px-4 flex gap-2">
                                <button
                                  onClick={() => startEditProject(p)}
                                  className="btn btn-xs btn-outline dark:text-white"
                                  title="Edit Project"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  onClick={() => deleteProject(p._id || p.id)}
                                  className="btn btn-xs btn-error text-white"
                                  title="Delete Project"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROJECTS CRUD PANEL */}
            {activeTab === "projects" && (
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Form to Create/Update Project */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm lg:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    {isEditing ? "Edit Project Details" : "Add New Portfolio Project"}
                  </h3>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. Finance Hub Webapp"
                        className="w-full input input-bordered bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full select select-bordered bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
                      >
                        <option value="UI-UX DESIGN">UI-UX DESIGN</option>
                        <option value="WEB DEVELOPMENT">WEB DEVELOPMENT</option>
                        <option value="AI / MACHINE LEARNING">AI / MACHINE LEARNING</option>
                        <option value="MOBILE APP DESIGN">MOBILE APP DESIGN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea
                        required
                        rows="3"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Describe the case study details..."
                        className="w-full textarea textarea-bordered bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                      <input
                        type="text"
                        required
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="e.g. https://domain.com/image.png or card1/card2 fallback"
                        className="w-full input input-bordered bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Specify a direct image link. Enter <b>card1</b>, <b>card2</b>, <b>card3</b>, <b>card4</b>, <b>card5</b> or <b>card6</b> to use standard assets template.</span>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Case Study Link</label>
                      <input
                        type="text"
                        value={projectForm.link}
                        onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                        placeholder="e.g. https://github.com/... or #!"
                        className="w-full input input-bordered bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="btn btn-primary flex-1 font-semibold cursor-pointer"
                      >
                        <FontAwesomeIcon icon={isEditing ? faEdit : faFolderPlus} className="mr-1.5" />
                        {isEditing ? "Save Changes" : "Create Project"}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setProjectForm({ id: null, title: "", category: "UI-UX Design", description: "", image: "", link: "" });
                          }}
                          className="btn btn-outline dark:text-white dark:border-gray-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List Projects */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Existing Projects List</h3>
                  {projects.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No projects added yet.</p>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {projects.map((p) => (
                        <div
                          key={p._id || p.id}
                          className="flex items-center gap-4 p-4 border border-gray-150 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-950/20 transition-all"
                        >
                          <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {p.image && !p.image.startsWith("card") && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                              <img src={p.image} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <FontAwesomeIcon icon={faFolder} className="text-picto-primary text-xl" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{p.title}</h4>
                            <p className="text-xs font-semibold text-picto-primary uppercase mt-0.5">{p.category}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{p.description}</p>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              onClick={() => startEditProject(p)}
                              className="btn btn-xs btn-outline dark:text-white gap-1"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProject(p._id || p.id)}
                              className="btn btn-xs btn-error text-white gap-1"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MESSAGES / INQUIRIES PANEL */}
            {activeTab === "messages" && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Contact Messages</h3>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No contact inquiries found.</p>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {messages.map((m) => (
                      <div
                        key={m._id || m.id}
                        className={`p-5 border rounded-2xl transition-all ${
                          !m.isRead
                            ? "border-picto-primary bg-picto-primary/5 dark:bg-picto-primary/10"
                            : "border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-150 dark:border-gray-800 pb-3 mb-3">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white text-base mr-2">{m.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({m.email})</span>
                            <div className="flex flex-wrap gap-2.5 mt-1 text-[11px] font-medium text-gray-400">
                              <span>Location: {m.location}</span>
                              <span>•</span>
                              <span>Budget: {m.budget}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            {!m.isRead && (
                              <button
                                onClick={() => markMessageAsRead(m._id || m.id)}
                                className="btn btn-xs btn-primary gap-1"
                              >
                                <FontAwesomeIcon icon={faEnvelopeOpen} />
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteMessage(m._id || m.id)}
                              className="btn btn-xs btn-error text-white gap-1"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-picto-primary uppercase tracking-wider mb-1">Subject: {m.subject}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl mt-2">
                            {m.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RESUME PDF CONFIG PANEL */}
            {activeTab === "settings" && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-500 p-4 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-900">
                    <FontAwesomeIcon icon={faFilePdf} className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">CV/Resume File Upload</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Replace the placeholder file served during resume download. The file must be in PDF format.
                  </p>
                </div>
                
                <form onSubmit={handleResumeUpload} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center cursor-pointer hover:border-picto-primary dark:hover:border-picto-primary bg-gray-50 dark:bg-gray-850/50 transition-colors">
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf"
                      required
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                    <label htmlFor="resume-file" className="cursor-pointer">
                      <FontAwesomeIcon icon={faUpload} className="text-2xl text-gray-400 mb-2.5 block mx-auto" />
                      <span className="text-sm font-semibold text-picto-primary block">
                        {resumeFile ? resumeFile.name : "Select PDF Document"}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">PDF Max size 5MB</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!resumeFile}
                    className="w-full btn btn-primary font-semibold text-[16px] cursor-pointer disabled:bg-gray-300"
                  >
                    Upload and Apply File
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
