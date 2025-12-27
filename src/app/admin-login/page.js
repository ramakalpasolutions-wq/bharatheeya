// src/app/admin-login/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import lock from "react-useanimations/lib/lock";
import loading2 from "react-useanimations/lib/loading2";
import { FaUser, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [isMounted, setIsMounted] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setCredentials({ username: "The Bharatheeya Seva Samithi", password: "" });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay for better UX
    setTimeout(() => {
      if (credentials.username === "The Bharatheeya Seva Samithi" && credentials.password === "BSS@2025") {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid username or password");
        setShake(true);
        setIsLoading(false);
        setTimeout(() => setShake(false), 500);
      }
    }, 1000);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF]">
        <div className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 text-center shadow-[0_20px_60px_0_rgba(139,26,90,0.15)]">
          <UseAnimations animation={loading2} size={56} strokeColor="#f8d46a" />
          <div className="mt-4 text-[#8B1A5A] font-light">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #8B1A5A 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated Background Elements - Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-[#FF69B4]/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B1A5A]/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl relative z-10"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 md:p-10 shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#8B1A5A]/20 to-[#FF69B4]/20 shadow-lg">
                <FaShieldAlt className="text-5xl text-[#FF69B4]" />
              </div>
            </motion.div>

            <h1 className="text-4xl font-light text-[#8B1A5A] mb-2">Admin Portal</h1>
            <div className="text-sm text-[#8B1A5A]/70 font-light">The Bharatheeya Seva Welfare Society Management System</div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30"
              >
                <div className="text-md text-red-600 flex items-center gap-2 font-light">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-[#8B1A5A]/80 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B1A5A]/60">
                  <FaUser className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => {
                    setCredentials({ ...credentials, username: e.target.value });
                    setError("");
                  }}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-[#8B1A5A]/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B1A5A]/60">
                  <FaLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials({ ...credentials, password: e.target.value });
                    setError("");
                  }}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B1A5A]/60 hover:text-[#FF69B4] transition-colors"
                >
                  {showPassword ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-gradient-to-r mt-9 from-[#8B1A5A] to-[#FF69B4] text-white font-bold text-lg shadow-2xl hover:shadow-[#FF69B4]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <UseAnimations animation={loading2} size={24} strokeColor="#ffffff" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt className="text-xl" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 rounded-2xl bg-[#8B1A5A]/10 border-2 border-[#8B1A5A]/20">
            <div className="text-xs text-[#8B1A5A]/70 text-center flex items-center justify-center gap-2 font-light">
              <UseAnimations animation={lock} size={20} strokeColor="#8B1A5A" />
              <span>Admin access only</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <motion.a
              href="/"
              className="text-sm text-[#8B1A5A]/70 hover:text-[#FF69B4] transition-colors inline-flex items-center gap-2 mt-1 font-light"
              whileHover={{ x: -3 }}
            >
              <span>←</span>
              <span>Back to Website</span>
            </motion.a>
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
}
