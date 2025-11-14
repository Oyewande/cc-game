import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../../firebase/config"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import GoogleIcon from "@mui/icons-material/Google"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2.5">
      <div>
        <label className="block text-xs font-semibold mb-1
                         text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
          Email Address
        </label>
        <div className="relative">
          <EmailIcon className="absolute left-2 top-1.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs md:text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/50 dark:placeholder:text-[#cbd6f0]/50
                      border border-[#425278]/30 dark:border-[#6b7aa8]/50
                      focus:outline-none focus:ring-2 focus:ring-[#425278]/50 dark:focus:ring-[#6b7aa8]/50
                      transition-colors duration-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1
                         text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
          Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-2 top-1.5 text-[#425278]/50 dark:text-[#cbd6f0]/50" fontSize="small" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-8 pr-8 py-1.5 rounded-md text-xs md:text-sm
                      bg-white dark:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0]
                      placeholder:text-[#425278]/50 dark:placeholder:text-[#cbd6f0]/50
                      border border-[#425278]/30 dark:border-[#6b7aa8]/50
                      focus:outline-none focus:ring-2 focus:ring-[#425278]/50 dark:focus:ring-[#6b7aa8]/50
                      transition-colors duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1.5 text-[#425278]/50 dark:text-[#cbd6f0]/50
                      hover:text-[#425278] dark:hover:text-[#aab6d6] transition-colors duration-300"
          >
            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                       rounded-md text-red-600 dark:text-red-400 text-xs transition-colors duration-300">
          {error}
        </div>
      )}

      <button
        onClick={handleEmailLogin}
        disabled={loading}
        className="w-full py-2 rounded-md shadow font-semibold text-xs md:text-sm
                  bg-[#425278] hover:bg-[#3a4770] text-white
                  dark:bg-[#6b7aa8] dark:hover:bg-[#556294]
                  transition-colors duration-300
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="flex items-center gap-2 py-0.5">
        <div className="flex-1 h-px bg-[#425278]/20 dark:bg-[#6b7aa8]/30"></div>
        <span className="text-[#425278]/60 dark:text-[#cbd6f0]/60 text-xs">Or continue with</span>
        <div className="flex-1 h-px bg-[#425278]/20 dark:bg-[#6b7aa8]/30"></div>
      </div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold text-xs md:text-sm
                  bg-white dark:bg-[#49546F]
                  text-[#425278] dark:text-[#cbd6f0]
                  border border-[#425278]/30 dark:border-[#6b7aa8]/50
                  hover:bg-gray-50 dark:hover:bg-[#556294]
                  transition-colors duration-300
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon fontSize="small" />
        Sign in with Google
      </button>
    </div>
  )
}
