import { useState } from "react"
import Navbar from "../components/UI/Navbar"
import LoginForm from "../components/Auth/LoginForm"
import SignupForm from "../components/Auth/SignupForm"

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-3 md:mb-4">
            <h1 className="text-xl md:text-2xl font-bold mb-0.5
                          text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
              Countries & Capitals
            </h1>
            <p className="text-xs md:text-sm text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
              Test your geography knowledge!
            </p>
          </div>

          <div className="bg-white dark:bg-[#33405D] rounded-xl shadow-lg p-4 md:p-5
                          transition-colors duration-300">
            <div className="text-center mb-3 md:mb-4">
              <h1 className="text-lg md:text-xl font-bold mb-0.5
                            text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
                {isLogin ? "Welcome Back" : "Join Us"}
              </h1>
              <p className="text-xs text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
                {isLogin ? "Sign in to your account" : "Create a new account"}
              </p>
            </div>

            <div className="flex gap-2 mb-3 md:mb-4 bg-gray-100 dark:bg-[#49546F] rounded-lg p-1
                            transition-colors duration-300">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md cursor-pointer font-semibold transition-all duration-300 ${
                  isLogin 
                    ? "bg-[#425278] hover:bg-[#3a4770] text-white shadow-md dark:bg-[#6b7aa8] dark:hover:bg-[#556294]" 
                    : "text-[#425278] dark:text-[#cbd6f0] hover:text-[#3a4770] dark:hover:text-[#aab6d6]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md cursor-pointer font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? "bg-[#425278] hover:bg-[#3a4770] text-white shadow-md dark:bg-[#6b7aa8] dark:hover:bg-[#556294]" 
                    : "text-[#425278] dark:text-[#cbd6f0] hover:text-[#3a4770] dark:hover:text-[#aab6d6]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? <LoginForm setUser={setUser} /> : <SignupForm setUser={setUser} setIsLogin={setIsLogin} />}
          </div>
        </div>
      </div>
    </div>
  )
}
