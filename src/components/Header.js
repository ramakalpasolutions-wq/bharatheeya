"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const navItems = ["Home", "About", "Programs", "Gallery", "Contact"];

  return (
<header
  className="w-full z-1 fixed top-0 left-0 bg-gradient-to-r from-[#2B0F1C] via-[#3A1728] to-[#2B0F1C] shadow-lg backdrop-blur-md"
>

      {/* DESKTOP */}
      <div className="hidden lg:flex items-center justify-between p-2 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img
            src="/the_bharatheeya_seva_welfare_society.png"
            alt="Logo"
            className="w-30 h-30 ml-9 rounded-md object-cover p-1"
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="inline-block text-2xl font-georgia font-bold text-[#FF69B4] drop-shadow-[0_0_12px_rgba(255,105,180,0.5)] hover-lift"
            >
              The Bharatheeya Seva Welfare Society
            </Link>
          </motion.div>
        </div>

        <nav className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-8 text-lg font-semibold text-[#FFF8E7]">
            {navItems.map((item) => {
              const href = `/${item === "Home" ? "" : item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className="relative inline-block py-2 px-4 rounded-xl glass-effect hover:text-[#FF69B4] hover:bg-[#FF69B4]/20 transition-all duration-300 hover-lift after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FF69B4] after:transition-all hover:after:w-full"
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <Link
            href="/donate"
            className="btn-glass text-[#FF69B4] font-bold px-8 py-3 text-lg hover-lift shadow-lg"
          >
            Donate
          </Link>
        </nav>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden fixed top-0 left-1/2 -translate-x-1/2 w-[110%] z-10">
        <div className=" px-4 py-4 shadow-2xl border border-[#FF69B4]/20 flex items-center justify-between rounded-2xl mx-2">
          <div className="flex items-center gap-1">
            <img
              src="/the_bharatheeya_seva_welfare_society.png"
              alt="Logo"
              className="w-16 h-16 rounded-xl object-fit  p-1"
            />

            <Link 
              href="/" 
              className="text-sm font-georgia font-bold text-[#FF69B4]"
            >
              The Bharatheeya Seva Welfare Society
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="p-3 rounded-xl glass-effect hover:bg-[#FF69B4]/20 transition-all duration-300 hover-lift"
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <svg width="24" height="24" stroke="#FF69B4" strokeWidth="2.5">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`mt-3 mx-2 overflow-hidden rounded-3xl bg-black/100 backdrop-blur-xl shadow-2xl border border-[#FF69B4]/10 transition-all duration-500 ${
            open ? "max-h-120 py-4" : "max-h-0 py-0"
          }`}
        >
          <nav className="px-4">
            <ul className="flex flex-col gap-3 text-base text-[#FFF8E7]">
              {navItems.map((item) => {
                const href = `/${item === "Home" ? "" : item.toLowerCase()}`;
                return (
                  <Link
                    key={item}
                    href={href}
                    className="px-6 py-3 rounded-2xl glass-effect hover:bg-[#FF69B4]/20 hover:text-[#FF69B4] hover-lift transition-all duration-300 block font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </Link>
                );
              })}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#FF69B4]/20">
              <Link
                href="/donate"
                className="w-full block text-center px-6 py-4 btn-glass text-[#FF69B4] font-bold text-lg hover-lift shadow-lg transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                Donate Now
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* spacing for mobile */}
      <div className="lg:hidden h-24" />
    </header>
  );
}
