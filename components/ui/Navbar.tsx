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
        {/* Updated Request Demo Button */}
        <Link href="/request-demo">
          <button className="relative group px-5 py-2 flex items-center space-x-2 text-blue-600 border border-blue-600 rounded-lg overflow-hidden transition-all duration-300">
            <span className="relative z-10 group-hover:text-white transition">Book a Demo</span>
            <svg
              className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="absolute inset-0 bg-blue-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
          </button>
        </Link>

        <Link href="/auth/signin" className="text-gray-600 hover:text-blue-600 transition">
          Log In
        </Link>
        <Link href="/auth/signup">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
