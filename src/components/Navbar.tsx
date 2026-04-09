"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 bg-[#0a1733]/85 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-center pointer-events-auto pl-4">
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95 group">
          <Image
            src="/WLogo.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            priority
          />
        </Link>
      </div>


    </motion.nav>
  );
}
