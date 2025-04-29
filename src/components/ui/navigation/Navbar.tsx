"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { username, logout, token, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading || !token || !username) return null; // Don't render navbar until token is valid

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-indigo-600">DevLinkVault</div>
        <ul className="flex items-center gap-6 text-md text-gray-700">
          <li>
            <Link href="/dashboard" className={pathname === "/dashboard" ? "text-indigo-600 font-bold text-lg" : "text-indigo-500 hover:text-indigo-600"}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href={`/user/${username}`} className={pathname === `/user/${username}` ? "text-indigo-600 font-bold text-lg" : "text-indigo-500 hover:text-indigo-600"}>
              Profile
            </Link>
          </li>
          <li>
            <Link href="/links" className={pathname === "/links" ? "text-indigo-600 font-bold text-lg" : "text-indigo-500 hover:text-indigo-600"}>
              My Links
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-red-500 hover:text-red-600 hover:cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
