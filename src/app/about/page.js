"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  FaHandHoldingHeart, 
  FaUsers, 
  FaEye, 
  FaBullseye, 
  FaStar, 
  FaAward,
  FaHome,
  FaHospitalAlt,
  FaGraduationCap,
  FaBalanceScale,
  FaUserShield,
  FaFemale,
  FaPrayingHands,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function About() {
  const [visionOpen, setVisionOpen] = useState(true);
  const [missionOpen, setMissionOpen] = useState(false);

  const headerRef = useRef(null);
  const visionMissionRef = useRef(null);
  const valuesRef = useRef(null);
  const wingsRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });
  const isVisionMissionInView = useInView(visionMissionRef, { once: true, amount: 0.2 });
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.2 });
  const isWingsInView = useInView(wingsRef, { once: true, amount: 0.1 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  const coreValues = [
    {
      icon: FaHandHoldingHeart,
      title: "Compassion",
      desc: "Providing care and support services with dignity to all, irrespective of caste, community, or religion.",
    },
    {
      icon: FaUsers,
      title: "Social Welfare",
      desc: "Dedicated to promoting education, human rights, and comprehensive social welfare across Andhra Pradesh.",
    },
    {
      icon: FaStar,
      title: "Transparency",
      desc: "Operating with complete accountability, with no commercial motive and all activities conducted ethically.",
    },
    {
      icon: FaAward,
      title: "Non-Profit",
      desc: "100% non-profit organization where all funds are utilized solely for achieving our social welfare objectives.",
    },
  ];

  const socialWelfareWings = [
    {
      icon: FaHome,
      title: "Old Age Home Wing",
      desc: "Shelter, care, and support services for senior citizens including food, clothing, and medical care."
    },
    {
      icon: FaFemale,
      title: "Women Empowerment Wing",
      desc: "Skill development, entrepreneurship programs, and health initiatives to empower women."
    },
    {
      icon: FaBalanceScale,
      title: "Women's Rights Wing",
      desc: "Legal aid services, awareness campaigns, and advocacy for women's rights."
    },
    {
      icon: FaPrayingHands,
      title: "Spiritual Wing",
      desc: "Promoting spiritual growth through events, workshops, and guidance, fostering community well-being."
    },
    {
      icon: FaUsers,
      title: "Youth Wing",
      desc: "Skill development, leadership initiatives, and community service projects for youth empowerment."
    },
    {
      icon: FaHospitalAlt,
      title: "Hospital Wing",
      desc: "Medical care, health awareness programs, and community health initiatives."
    },
    {
      icon: FaGraduationCap,
      title: "Educational Wing",
      desc: "Literacy programs, skill development workshops, and scholarship programs."
    },
    {
      icon: FaUserShield,
      title: "Human Rights Wing",
      desc: "Legal aid services, awareness campaigns, and research on human rights issues."
    }
  ];

  const missionPoints = [
    "Provide comprehensive healthcare through medical camps, health awareness programs, and community health initiatives",
    "Empower individuals through literacy programs, skill development workshops, and educational scholarships",
    "Support senior citizens with shelter, care, food, clothing, and medical services through our Old Age Home Wing",
    "Promote and protect human rights through legal aid services, awareness campaigns, and research initiatives",
    // "Combat corruption through whistleblower protection, investigation services, and anti-corruption awareness",
    "Empower women through skill development, entrepreneurship programs, legal aid, and health initiatives",
    "Support people with disabilities through rehabilitation services, support programs, and accessibility initiatives",
    "Foster youth development through leadership training, skill development, and community service projects",
    // "Promote spiritual growth through community events, workshops, and spiritual guidance",
    "Preserve cultural heritage through temple management and community development initiatives"
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
                  Registered Non-Profit Organization
                </span>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5" 
                     style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] text-[#8B1A5A] tracking-tight" 
                  style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  About The Bharatheeya Seva
                </motion.span>
                <motion.span
                  className="block mt-3 font-serif  text-[#FF69B4]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  style={{ textShadow: '0 4px 20px rgba(255, 105, 180, 0.2)' }}
                >
                  Welfare Society
                </motion.span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 1 }}
              className="max-w-8xl mx-auto"
            >
              <p className="text-lg sm:text-2xl text-[#8B1A5A]/70 font-light leading-relaxed mb-8">
                A registered non-profit organization promoting education, human rights, and social welfare
              </p>

              {/* Intro Card */}
              <div className="backdrop-blur-2xl  bg-white/40 rounded-3xl border border-white/60 p-8 lg:p-10 text-left"
                   style={{
                     boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                   }}>
                <div className="space-y-4 text-base sm:text-2xl text-[#8B1A5A]/80 font-medium leading-relaxed">
                  <p>
                    <strong className="text-[#8B1A5A] font-normal">The Bharatheeya Seva Welfare Society</strong> is a registered non-profit organization operating across Andhra Pradesh under the Andhra Pradesh Societies Registration Act, 2001. The society is formed with no profit motive and no commercial activity, dedicated to creating lasting positive change in the lives of communities across the state.
                  </p>

                  <p>
                    Our organization focuses on promoting <span className="text-[#FF69B4] font-medium">education, human rights, and comprehensive social welfare</span> through multiple specialized wings that address diverse community needs. Headquartered at D.No 12-128, Opp. Govt Hospital, Addanki, Bapatla District, we operate with complete transparency and accountability.
                  </p>

                  <p>
                    The society's benefits are open to all irrespective of caste, community, or religion. All office bearers serve voluntarily without payment from society funds, and all resources are utilized solely for fulfilling our social welfare objectives.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

       
      </motion.section>

      {/* Vision & Mission Section */}
      <section ref={visionMissionRef} className="relative sm:py-28 lg:py-2">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Card - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isVisionMissionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-10 lg:p-12 h-full"
                   style={{
                     boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50 rounded-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-18">
                    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-4 border border-white/40"
                         style={{ boxShadow: '0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)' }}>
                      <FaEye className="text-4xl text-[#8B1A5A]" 
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 26, 90, 0.2))' }} />
                    </div>
                    <h3 className="text-3xl sm:text-5xl font-light text-[#8B1A5A]">
                      Our <span className="font-serif text-[#FF69B4]">Vision</span>
                    </h3>
                  </div>

                  <div className="space-y-12 text-base sm:text-2xl text-[#8B1A5A]/70 font-light leading-relaxed">
                    <p>
                      To build an <strong className="text-[#8B1A5A] font-normal">inclusive and empowered society</strong> where every individual—regardless of caste, community, religion, or social background—has access to quality education, comprehensive healthcare, legal protection, and fundamental human rights.
                    </p>
                    <p>
                      We envision creating <strong className="text-[#8B1A5A] font-normal">sustainable support systems</strong> that provide dignity, security, and opportunities for all members of society to thrive and contribute to community development.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision Card - Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setVisionOpen(!visionOpen)}
                className="w-full backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 flex items-center justify-between"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40">
                    <FaEye className="text-2xl text-[#8B1A5A]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-light text-[#8B1A5A]">Our Vision</h3>
                    <p className="text-xs text-[#8B1A5A]/60 mt-1">
                      Tap to {visionOpen ? "collapse" : "expand"}
                    </p>
                  </div>
                </div>
                {visionOpen ? <FaChevronUp className="text-[#8B1A5A]" /> : <FaChevronDown className="text-[#8B1A5A]" />}
              </button>

              <AnimatePresence>
                {visionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6"
                         style={{
                           boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                         }}>
                      <div className="space-y-3 text-sm text-[#8B1A5A]/70 font-light leading-relaxed">
                        <p>
                          To build an <strong className="text-[#8B1A5A] font-normal">inclusive and empowered society</strong> where every individual—regardless of caste, community, religion, or social background—has access to quality education, comprehensive healthcare, legal protection, and fundamental human rights.
                        </p>
                        <p>
                          We envision creating <strong className="text-[#8B1A5A] font-normal">sustainable support systems</strong> that provide dignity, security, and opportunities for all members of society to thrive and contribute to community development.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mission Card - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isVisionMissionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-10 lg:p-12 h-full overflow-y-auto max-h-[600px]"
                   style={{
                     boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50 rounded-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-4 border border-white/40"
                         style={{ boxShadow: '0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)' }}>
                      <FaBullseye className="text-4xl text-[#8B1A5A]" 
                                  style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 26, 90, 0.2))' }} />
                    </div>
                    <h3 className="text-3xl sm:text-5xl font-light text-[#8B1A5A]">
                      Our <span className="font-serif text-[#FF69B4]">Mission</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {missionPoints.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-base text-[#8B1A5A]/70 font-light leading-relaxed"
                      >
                        <span className="text-[#FF69B4] text-xl mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-2xl">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission Card - Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setMissionOpen(!missionOpen)}
                className="w-full backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 flex items-center justify-between"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40">
                    <FaBullseye className="text-2xl text-[#8B1A5A]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-light text-[#8B1A5A]">Our Mission</h3>
                    <p className="text-xs text-[#8B1A5A]/60 mt-1">
                      Tap to {missionOpen ? "collapse" : "expand"}
                    </p>
                  </div>
                </div>
                {missionOpen ? <FaChevronUp className="text-[#8B1A5A]" /> : <FaChevronDown className="text-[#8B1A5A]" />}
              </button>

              <AnimatePresence>
                {missionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6"
                         style={{
                           boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                         }}>
                      <div className="space-y-2">
                        {missionPoints.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#8B1A5A]/70 font-light leading-relaxed"
                          >
                            <span className="text-[#FF69B4] text-base mt-0.5 flex-shrink-0">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section ref={valuesRef} className="relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isValuesInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16 sm:mb-20"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light">
              Our Foundation
            </span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5 mb-8" 
                 style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#8B1A5A] mb-6" 
                style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
              Our Core <span className="font-serif italic text-[#FF69B4]">Values</span>
            </h2>
            
            <p className="text-lg text-[#8B1A5A]/70 max-w-2xl mx-auto font-light leading-relaxed">
              Principles that guide our non-profit operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -10 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="inline-block mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="backdrop-blur-md bg-white/30 rounded-2xl p-4 border border-white/40 inline-block"
                           style={{ boxShadow: '0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)' }}>
                        <Icon className="text-4xl text-[#8B1A5A]" 
                              style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 26, 90, 0.2))' }} />
                      </div>
                    </motion.div>

                    <h3 className="text-xl sm:text-3xl font-light text-[#8B1A5A] mb-4 group-hover:text-[#FF69B4] transition-colors">
                      {value.title}
                    </h3>

                    <p className="text-sm sm:text-xl text-[#8B1A5A]/70 leading-relaxed font-light">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Primary Wings Section */}
      <section ref={wingsRef} className="relative py-1 sm:py-1 lg:py-1">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isWingsInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16 sm:mb-20"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light">
              Our Services
            </span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5 mb-8" 
                 style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#8B1A5A] mb-6" 
                style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
              Our Primary <span className="font-serif italic text-[#FF69B4]">Wings</span>
            </h2>
            
            <p className="text-lg text-[#8B1A5A]/70 max-w-3xl mx-auto font-light leading-relaxed">
              Specialized divisions addressing diverse community needs across Andhra Pradesh
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {socialWelfareWings.map((wing, i) => {
              const Icon = wing.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isWingsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.8 }}
                  className="group relative backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -10 }}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="inline-block mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="backdrop-blur-md bg-white/30 rounded-2xl p-3 border border-white/40 inline-block"
                           style={{ boxShadow: '0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)' }}>
                        <Icon className="text-3xl text-[#8B1A5A]" 
                              style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 26, 90, 0.2))' }} />
                      </div>
                    </motion.div>

                    <h3 className="text-lg sm:text-2xl font-light text-[#8B1A5A] mb-4 group-hover:text-[#FF69B4] transition-colors">
                      {wing.title}
                    </h3>

                    <p className="text-xl text-[#8B1A5A]/70 leading-relaxed font-light">
                      {wing.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-4">
                <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light" 
                      style={{ textShadow: '0 2px 10px rgba(139, 26, 90, 0.1)' }}>
                  Be Part of the Change
                </span>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto" 
                     style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#8B1A5A] mb-6" 
                  style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                Join Our <span className="font-serif italic text-[#FF69B4]">Mission</span>
              </h2>

              <p className="text-lg sm:text-xl text-[#8B1A5A]/70 max-w-3xl mx-auto font-light leading-relaxed">
                Together, we can create lasting change. Every contribution brings us closer to building an empowered and inclusive society for all.
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
                  <span className="relative z-10 font-light tracking-wider uppercase text-sm">Support Us</span>
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

            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF69B4]/10 to-transparent rounded-bl-full opacity-50" />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
