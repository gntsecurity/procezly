"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-50 transition-all duration-300 ${
        scrolling ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <motion.div
        className="text-2xl font-extrabold tracking-tight text-gray-900"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/">Procezly</Link>
      </motion.div>
      <div className="space-x-6 flex items-center">
        <Link href="/request-demo">
          <button className="px-4 py-2 flex items-center space-x-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
            <span>Request Demo</span>
          </button>
        </Link>
        <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">
          Sign In
        </Link>
        <Link href="/signup">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
