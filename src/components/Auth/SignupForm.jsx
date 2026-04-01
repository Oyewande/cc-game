import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { friendlyAuthError } from "../../context/AuthContext";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SignupForm({ setIsLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("Please choose a username.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, trimmedUsername);
      navigate("/");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignup} noValidate className="space-y-3">
      <div>
        <label className="block text-xs font-semibold mb-1.5
                         text-[#425278] dark:text-[#aab6d6]">
          Username
        </label>
        <div className="relative">
          <PersonIcon className="absolute left-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            autoComplete="username"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/40 dark:placeholder:text-[#cbd6f0]/40
                      border border-[#425278]/20 dark:border-[#6b7aa8]/30
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5
                         text-[#425278] dark:text-[#aab6d6]">
          Email Address
        </label>
        <div className="relative">
          <EmailIcon className="absolute left-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/40 dark:placeholder:text-[#cbd6f0]/40
                      border border-[#425278]/20 dark:border-[#6b7aa8]/30
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5
                         text-[#425278] dark:text-[#aab6d6]">
          Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password (6+ characters)"
            autoComplete="new-password"
            className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/40 dark:placeholder:text-[#cbd6f0]/40
                      border border-[#425278]/20 dark:border-[#6b7aa8]/30
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50
                      hover:text-[#425278] dark:hover:text-[#aab6d6] transition-colors"
          >
            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5
                         text-[#425278] dark:text-[#aab6d6]">
          Confirm Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/40 dark:placeholder:text-[#cbd6f0]/40
                      border border-[#425278]/20 dark:border-[#6b7aa8]/30
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50
                      hover:text-[#425278] dark:hover:text-[#aab6d6] transition-colors"
          >
            {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                       rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg shadow font-semibold text-sm
                  bg-[#0f172a] hover:bg-[#1e293b] text-white
                  dark:bg-emerald-600 dark:hover:bg-emerald-700
                  transition-all duration-300
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[#425278]/15 dark:bg-[#6b7aa8]/20"></div>
        <span className="text-[#425278]/50 dark:text-[#cbd6f0]/50 text-xs">or</span>
        <div className="flex-1 h-px bg-[#425278]/15 dark:bg-[#6b7aa8]/20"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm
                  bg-white dark:bg-[#49546F]
                  text-[#425278] dark:text-[#cbd6f0]
                  border border-[#425278]/20 dark:border-[#6b7aa8]/30
                  hover:bg-gray-50 dark:hover:bg-[#556294]
                  transition-all duration-300
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon fontSize="small" />
        Continue with Google
      </button>
    </form>
  );
}
