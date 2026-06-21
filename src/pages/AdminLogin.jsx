import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (localStorage.getItem("token")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("adminUser", JSON.stringify({ username: data.username }));
      
      // Dispatch event to refresh Navbar
      window.dispatchEvent(new Event("admin-login-changed"));
      
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300">
        <div className="text-center mb-8">
          <div className="bg-picto-primary/10 text-picto-primary p-4 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faLock} className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Log in to manage projects and contact form messages.
          </p>
        </div>

        {error && (
          <div className="alert alert-error text-sm rounded-lg p-3 text-white flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full input input-bordered pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full input input-bordered pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-picto-primary text-gray-950 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary mt-4 font-semibold text-[16px] cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        
        <div className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500">
          <p>Default: admin / adminpassword</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
