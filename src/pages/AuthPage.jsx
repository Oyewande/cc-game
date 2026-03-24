import { useState } from "react";
import Navbar from "../components/UI/Navbar";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-1
                          text-slate-800 dark:text-white">
              Capitals Quest
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Test your geography knowledge
            </p>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60
                          p-5 md:p-6 transition-colors duration-300">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-0.5
                            text-slate-800 dark:text-white">
                {isLogin ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isLogin ? "Sign in to your account" : "Create a new account"}
              </p>
            </div>

            <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg cursor-pointer font-semibold text-sm transition-all duration-300 ${
                  isLogin
                    ? "bg-white dark:bg-emerald-600 text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg cursor-pointer font-semibold text-sm transition-all duration-300 ${
                  !isLogin
                    ? "bg-white dark:bg-emerald-600 text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? <LoginForm /> : <SignupForm setIsLogin={setIsLogin} />}
          </div>
        </div>
      </div>
    </div>
  );
}
