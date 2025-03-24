"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const closeBanner = () => {
    setIsBannerVisible(false);
  };

  return (
    <div className="relative">
      {/* Banner */}
      {isBannerVisible && (
        <div className="bg-yellow-500 text-white text-sm py-2 text-center flex justify-between px-6 items-center fixed top-0 left-0 right-0 z-50">
          <span>
            Procezly.io is currently under construction. Backend features are not yet functional.
          </span>
          <button onClick={closeBanner} className="ml-4 text-gray-900 font-bold hover:text-white transition">
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-8 left-0 right-0 px-8 py-4 flex justify-between items-center z-40 transition-all duration-300 ${
          scrolling ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <motion.div className="text-2xl font-extrabold tracking-tight text-gray-900">
          <Link href="/">Procezly</Link>
        </motion.div>

        {/* Right-side Buttons (Responsive) */}
        <div className="flex space-x-4">
          {!isMobile && (
            <>
              <Link href="/demo">
                <motion.button className="px-5 py-2 text-blue-600 font-semibold border border-blue-600 rounded-lg bg-white hover:bg-blue-600 hover:text-white transition">
                  Book a Demo
                </motion.button>
              </Link>

              <Link href="/login">
                <motion.button className="px-5 py-2 font-semibold text-gray-900 bg-white rounded-lg hover:text-blue-600 transition">
                  Log In
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
