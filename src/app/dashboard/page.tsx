"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type UserData = {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { token, logout, loading } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    // If no token and auth is done checking, skip fetch
    if (!token && !loading) {
      setUserLoading(false);
      return;
    }

    if (loading || !token) return;

    const fetchUser = async () => {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setUserLoading(false);
    };

    fetchUser();
  }, [router, token, logout, loading]);

  if (loading || userLoading) {
    return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  }

  // Fallback UI for guest (not logged in)
  if (!token || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-50 px-6">
        <div className="max-w-md text-center bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">You&apos;re not logged in</h1>
          <p className="text-gray-600 mt-2">
            To access the dashboard, please log in or register.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition text-gray-700"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated dashboard view
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 space-y-6 border border-gray-200">
        <div>
          <h1>Welcome, {user.username} 👋</h1>
          <p className="text-gray-500 text-sm">
            Logged in as <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            What do you want to do today?
          </h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Edit your profile</li>
            <li>Manage your DevLinkVault links</li>
            <li>Share your public page</li>
          </ul>
        </div>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="bg-red-500 mt-6 px-4 py-2 text-white rounded-xl hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
