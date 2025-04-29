"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6"
    >
      <h1 className="text-6xl font-extrabold text-indigo-700 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">
        Oops! That page doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="text-indigo-600 underline hover:text-indigo-800 transition text-lg"
      >
        Go back to dashboard
      </Link>
      <p className="text-sm text-gray-500 mt-4">
        You’ll be redirected in <span className="font-semibold text-indigo-700">{seconds}</span>...
      </p>
    </motion.div>
  );
}
