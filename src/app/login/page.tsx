"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SmartInput from "@/components/ui/smartInput";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Login failed");
      return;
    }

    login(data.user, data.token); // updates global state
    router.push("/dashboard");
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
      >
        <div className="text-center">
          <h1>Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to your DevLinkVault account
          </p>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-center font-medium">{errorMsg}</p>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <SmartInput
            type="email"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholderText="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <SmartInput
            type="password"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholderText="••••••••"
            required
          />
        </div>

        <div className="flex space-x-2">
        <p>Don&apos;t have an account ?</p>
        <Link href={"/register"}><p><span className="font-bold text-indigo-600 hover:text-indigo-700">Register here</span></p></Link>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200 font-medium cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
