'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SmartInput from '../../components/ui/smartInput';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const router = useRouter();


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
          setPasswordError("Password needs to be at least 6 characters long.");
          return;
        } else {
          setPasswordError(""); // clears previous error if fixed.
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMessage(data.error || "Registration failed");
            return;
        }

        // Auto-login the user with a token if backend return one, more convenient for the user.
        localStorage.setItem("token", data.token);
        router.push("/dashboard")
    };

    return (
        <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
        >
          <div className="text-center">
            <h1>Create an Account</h1>
            <p className="text-sm text-gray-500 mt-2">Start building your DevLinkVault profile</p>
          </div>
  
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
  
          <div className="space-y-2">
            <label>Username</label>
            <SmartInput
            type="text"
            placeholderText="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          </div>
  
          <div className="space-y-2">
            <label>Email</label>
            <SmartInput
              type="email"
              placeholderText="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="space-y-2">
            <label>Password</label>
            <SmartInput
              type="password"
              placeholderText="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div className="flex space-x-2">
        <p>Already have an account ?</p>
        <Link href={"/login"}><p><span className="font-bold text-indigo-600 hover:text-indigo-700">Login</span></p></Link>
        </div>
  
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </main>
    )
}