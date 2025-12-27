"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  FaGraduationCap, 
  FaHeartbeat, 
  FaHome,
  FaBalanceScale,
  FaFemale,
  FaUsers,
  FaPray,
  FaSearchLocation,
  FaHandHoldingHeart,
  FaArrowRight,
} from "react-icons/fa";

export default function Programs() {
  const headerRef = useRef(null);
  const programsRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });
  const isProgramsInView = useInView(programsRef, { once: true, amount: 0.1 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  const programs = [
    {
      title: "Educational Wing",
      desc: "Literacy programs, skill development workshops, and scholarship programs to empower individuals through education and lifelong learning.",
      icon: FaGraduationCap,
      emoji: "📚",
    },
    {
      title: "Hospital & Healthcare Wing",
      desc: "Medical care, health awareness programs, community health initiatives, anti-drug counseling, and food safety inspection services.",
      icon: FaHeartbeat,
      emoji: "⚕️",
    },
    {
      title: "Old Age Home Wing",
      desc: "Comprehensive shelter, care, and support services for senior citizens including food, clothing, and medical care in a safe environment.",
      icon: FaHome,
      emoji: "🏠",
    },
    {
      title: "Women's Empowerment Wing",
      desc: "Skill development training, entrepreneurship programs, health initiatives, legal aid services, and advocacy for women's rights.",
      icon: FaFemale,
      emoji: "💪",
    },
    {
      title: "Human Rights Wing",
      desc: "Legal aid services, awareness campaigns, research initiatives, and vigilance programs to protect and promote fundamental human rights.",
      icon: FaBalanceScale,
      emoji: "⚖️",
    },
    {
      title: "Youth Development Wing",
      desc: "Skill development training, leadership initiatives, community service projects, and mentorship programs to empower young individuals.",
      icon: FaUsers,
      emoji: "👥",
    },
    {
      title: "Spiritual & Cultural Wing",
      desc: "Spiritual growth events, temple management, cultural heritage preservation, and community development initiatives.",
      icon: FaPray,
      emoji: "🕉️",
    },
    {
      title: "Community Support Services",
      desc: "Traffic safety awareness, consumer rights protection, tourism promotion, animal welfare (Gosamrakshana), fishermen support, and legal advisory.",
      icon: FaSearchLocation,
      emoji: "🤝",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF]">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #8B1A5A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated light orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF69B4]/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#8B1A5A]/10 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header Section */}
      <motion.section 
        ref={headerRef}
        className="relative py-21 sm:py-18 lg:py-21 overflow-hidden"
      >
        

        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHeaderInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 1 }}
                className="inline-block"
              >
                <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light" 
                      style={{ textShadow: '0 2px 10px rgba(139, 26, 90, 0.1)' }}>
                  Comprehensive Social Impact
                </span>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5" 
                     style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-[#8B1A5A] tracking-tight" 
                  style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Our Programs &
                </motion.span>
                <motion.span
                  className="block mt-3 font-serif italic text-[#FF69B4]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  style={{ textShadow: '0 4px 20px rgba(255, 105, 180, 0.2)' }}
                >
                  Specialized Wings
                </motion.span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 1 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-lg sm:text-2xl text-[#8B1A5A]/70 max-w-4xl mx-auto font-light leading-relaxed">
                The Bharatheeya Seva Welfare Society operates through specialized wings, each focused on addressing specific needs across Andhra Pradesh with transparency and measurable impact.
              </p>
            </motion.div>
          </motion.div>
        </div>

      </motion.section>

      {/* Programs Grid Section */}
      <section ref={programsRef} className="relative">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {programs.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isProgramsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 lg:p-10 transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -10, scale: 1.02 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {/* Glossy shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
                       style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />

                  {/* Icon and Emoji */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="relative inline-block"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="backdrop-blur-md bg-white/30 rounded-2xl p-4 border border-white/40"
                           style={{ boxShadow: '0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)' }}>
                        <Icon className="text-4xl text-[#8B1A5A]" 
                              style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 26, 90, 0.2))' }} />
                      </div>
                    </motion.div>

                    <motion.div
                      className="text-5xl"
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    >
                      {p.emoji}
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-light text-[#8B1A5A] mb-4 tracking-wide group-hover:text-[#FF69B4] transition-colors">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-xl text-[#8B1A5A]/70 leading-relaxed font-light">
                    {p.desc}
                  </p>

                  {/* Hover discover text */}
                  <div className="mt-6 inline-flex items-center gap-2 text-[#FF69B4] text-sm font-light tracking-wider uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                    <a href="contact">Learn More</a>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section 
        ref={ctaRef}
        className="relative py-20 sm:py-28 lg:py-36"
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-12 lg:p-16 overflow-hidden"
            style={{
              boxShadow: '0 20px 60px 0 rgba(139, 26, 90, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-4">
                <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light" 
                      style={{ textShadow: '0 2px 10px rgba(139, 26, 90, 0.1)' }}>
                  Join Our Mission
                </span>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto" 
                     style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#8B1A5A] mb-6" 
                  style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                Want to Make a <span className="font-serif italic text-[#FF69B4]">Difference?</span>
              </h2>

              <p className="text-lg sm:text-xl text-[#8B1A5A]/70 max-w-3xl mx-auto font-light leading-relaxed">
                Your support helps us expand these programs and reach more communities in need. Every contribution creates a lasting impact across Andhra Pradesh.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6">
                <motion.a
                  href="/donate"
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white overflow-hidden rounded-full transition-all duration-500 hover:shadow-2xl"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <FaHandHoldingHeart className="relative z-10 text-xl" />
                  <span className="relative z-10 font-light tracking-wider uppercase text-sm">Support Our Programs</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF69B4] to-[#8B1A5A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-full" />
                </motion.a>

                <motion.a
                  href="/contact"
                  className="inline-flex items-center gap-3 px-10 py-4 backdrop-blur-md bg-white/20 border border-white/40 text-[#8B1A5A] hover:bg-white/30 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <span className="font-light tracking-wider uppercase text-sm">Get Involved</span>
                  <FaArrowRight className="text-sm" />
                </motion.a>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF69B4]/10 to-transparent rounded-bl-full opacity-50" />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
