"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0a0612] via-[#120920] to-[#8B1A5A]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF69B4]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B1A5A]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* LOGO with entrance animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        >
          <motion.img
            src="/the_bharatheeya_seva_welfare_society.png"
            alt="Bharatheeya Seva logo"
            className="w-48 md:w-60 drop-shadow-2xl"
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(255,105,180,0.3))",
                "drop-shadow(0 0 30px rgba(255,105,180,0.5))",
                "drop-shadow(0 0 20px rgba(255,105,180,0.3))",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* BRAND NAME with stagger animation */}
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#FFF8E7] font-georgia tracking-wide">
            {"The Bharatheeya Seva Welfare Society".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </motion.div>

        {/* CIRCULAR SPINNER LOADER (New Effect) */}
      {/* Replace the circular spinner section with: */}
<motion.div
  className="flex gap-1.5"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  {[0, 1, 2, 3, 4, 5, 6].map((index) => (
    <motion.div
      key={index}
      className="w-2 h-2 bg-gradient-to-r from-[#FF69B4] to-[#FFB6D9] rounded-full"
      animate={{
        y: [0, -20, 0],
        opacity: [0.4, 1, 0.4],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        delay: index * 0.1,
        ease: "easeInOut",
      }}
    />
  ))}
</motion.div>


        {/* LOADING TEXT */}
        <motion.p
          className="text-[#FFF8E7]/70 text-sm font-medium tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}
