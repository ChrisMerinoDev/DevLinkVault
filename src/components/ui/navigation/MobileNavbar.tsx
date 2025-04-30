"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { username, logout, token, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading || !token || !username) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Hamburger icon */}
      <div className="flex mt-4 ml-4 sm:hidden top-4 left-4 z-50">
        <button onClick={() => setIsOpen(true)} className="text-indigo-700">
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-fit bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-8 py-4 border-b-2 border-indigo-50">
          <h2 className="text-2xl font-bold text-indigo-700">DevLinkVault</h2>
          <button onClick={() => setIsOpen(false)}>
          </button>
        </div>

        <ul className="flex flex-col gap-6 py-6 items-center text-indigo-500 hover:text-indigo-600 text-lg border-b-2 border-indigo-50">
          <li>
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? "text-indigo-600 font-bold bg-indigo-100 px-13 py-4 rounded-2xl shadow-sm" : ""}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href={`/user/${username}`}
              className={pathname === `/user/${username}` ? "text-indigo-600 font-bold bg-indigo-100 px-17 py-4 rounded-2xl shadow-sm" : ""}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/links"
              className={pathname === "/links" ? "text-indigo-600 font-bold bg-indigo-100 px-15 py-4 rounded-2xl shadow-sm" : ""}
              onClick={() => setIsOpen(false)}
            >
              My Links
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-red-500 text-left hover:text-red-600 cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
