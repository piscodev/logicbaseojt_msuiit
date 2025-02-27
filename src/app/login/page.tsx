"use client";

import { useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Messenger from "../components/ActionsMessage";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning'>('success');
  const [messageContent, setMessageContent] = useState('');
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    const showMessage = (type: 'success' | 'error' | 'warning', content: string) => {
      setMessageType(type);
      setMessageContent(content);
    };
    try {
      // Use correct API endpoints based on login or sign-up mode.
      const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const body = isLogin? { email, password }: {name, email, password};

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Auth failed:", data);
        throw new Error(data.error);
      }


      if (isLogin) {
        showMessage('success', "Login successful!")
        router.push("/dashboard")
        // setSuccessMessage("Login successful! Redirecting...");
        // setTimeout(() => router.push("/dashboard"), 250);
      } else {
        // router.push("/dashboard")
        // Sign-up branch: switch UI to login mode after a successful sign-up.
        setSuccessMessage("Account created successfully! Please log in.");
        showMessage('success', "Account created successfully! Please log in.")
        setIsLogin(true);
        // Optionally clear the fields so the login form is blank.
        setEmail("");
        setPassword("");
        setName("")
      }
    } catch (error:unknown) {
      showMessage('error', error as unknown as string)
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Messenger messageType={messageType} messageContent={messageContent} />
    
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>

        {/* Success Message */}
        {successMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 bg-green-100 p-3 rounded-md text-sm text-center mb-3"
          >
            {successMessage}
          </motion.p>
        )}

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 bg-red-100 p-3 rounded-md text-sm text-center mb-3"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && 
          (<div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-gray-100 border border-gray-300 pl-10 pr-3 py-2 rounded-md text-gray-800 focus:ring focus:ring-blue-300 outline-none transition-all"
              required
            />
          </div>)}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-gray-100 border border-gray-300 pl-10 pr-3 py-2 rounded-md text-gray-800 focus:ring focus:ring-blue-300 outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-100 border border-gray-300 pl-10 pr-3 py-2 rounded-md text-gray-800 focus:ring focus:ring-blue-300 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300 shadow-md flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                {isLogin ? "Logging in..." : "Signing up..."}
              </div>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 font-medium hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccessMessage("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
    </>
  );
}
