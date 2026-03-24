import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";
import { useAuth } from "../../context/useAuth";
import { friendlyAuthError } from "../../context/AuthContext";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firstName = (result.user.displayName || "").split(" ")[0] || "";
      if (firstName && result.user.displayName !== firstName) {
        await updateProfile(result.user, { displayName: firstName });
      }
      navigate("/");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const target = resetEmail.trim() || email.trim();
    if (!target) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(target);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#425278] dark:text-[#cbd6f0]">
          Enter your email and we'll send you a reset link.
        </p>
        <div className="relative">
          <EmailIcon className="absolute left-2.5 top-2.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type="email"
            value={resetEmail || email}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/40 dark:placeholder:text-[#cbd6f0]/40
                      border border-[#425278]/20 dark:border-[#6b7aa8]/30
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      transition-all duration-300"
          />
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                         rounded-lg text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}
        {resetSent && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800
                         rounded-lg text-emerald-700 dark:text-emerald-400 text-xs">
            Reset link sent! Check your inbox.
          </div>
        )}

        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full py-2.5 rounded-lg shadow font-semibold text-sm
                    bg-emerald-600 hover:bg-emerald-700 text-white
                    transition-all duration-300
                    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <button
          onClick={() => { setShowForgot(false); setError(""); }}
          className="w-full py-2 text-sm text-[#425278] dark:text-[#cbd6f0] hover:underline cursor-pointer"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
            placeholder="Enter your password"
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

      <div className="text-right">
        <button
          onClick={() => setShowForgot(true)}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                       rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      <button
        onClick={handleEmailLogin}
        disabled={loading}
        className="w-full py-2.5 rounded-lg shadow font-semibold text-sm
                  bg-[#0f172a] hover:bg-[#1e293b] text-white
                  dark:bg-emerald-600 dark:hover:bg-emerald-700
                  transition-all duration-300
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[#425278]/15 dark:bg-[#6b7aa8]/20"></div>
        <span className="text-[#425278]/50 dark:text-[#cbd6f0]/50 text-xs">or</span>
        <div className="flex-1 h-px bg-[#425278]/15 dark:bg-[#6b7aa8]/20"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
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
    </div>
  );
}
