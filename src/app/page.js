"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  FaHandHoldingHeart, 
  FaStethoscope,
  FaBookOpen,
  FaHandsHelping,
  FaPlay,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

function getImgUrlSafe(img) {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img;
  return img.optimized || img.original || img.thumb || null;
}

function PhotoCarousel({ slides, interval = 4000, desktopHeight = "75vh", showIndicators = true }) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const timerRef = useRef(null);
  const [height, setHeight] = useState(desktopHeight);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    function applyHeight() {
      const w = window.innerWidth;
      if (w < 640) setHeight("60vh");
      else if (w < 768) setHeight("65vh");
      else if (w < 1024) setHeight("70vh");
      else setHeight(desktopHeight);
    }
    applyHeight();
    window.addEventListener("resize", applyHeight);
    return () => window.removeEventListener("resize", applyHeight);
  }, [desktopHeight]);

  const safeSlides = Array.isArray(slides)
    ? slides
        .map((s) => {
          if (typeof s === "string") return s;
          const url = getImgUrlSafe(s);
          return url;
        })
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (running) startTimer();
    return () => stopTimer();
  }, [index, running, safeSlides.length]);

  function startTimer() {
    stopTimer();
    if (!running || safeSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((s) => (s + 1) % safeSlides.length);
    }, interval);
  }

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function pause() {
    setRunning(false);
    setTimeout(() => setRunning(true), 2000);
  }

  function prev() {
    if (safeSlides.length === 0) return;
    setDirection(-1);
    setIndex((s) => (s - 1 + safeSlides.length) % safeSlides.length);
    pause();
  }

  function next() {
    if (safeSlides.length === 0) return;
    setDirection(1);
    setIndex((s) => (s + 1) % safeSlides.length);
    pause();
  }

  function goTo(i) {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    pause();
  }

  if (!safeSlides || safeSlides.length === 0) return null;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1,
    }),
  };

  return (
    <div className="relative w-full">
      <motion.section 
        className="relative w-full overflow-hidden select-none rounded-2xl sm:rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          boxShadow: '0 20px 60px 0 rgba(139, 26, 90, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Glossy overlay with elegant gradients */}
        <div className="absolute inset-0 pointer-events-none z-[5]">
          {/* Bottom gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          
          {/* Subtle color tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A5A]/5 via-transparent to-[#FF69B4]/5" />
          
          {/* Glossy shine effect - top left */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" 
               style={{ 
                 backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%)',
               }} 
          />
        </div>

        {/* Image container with better object-fit */}
        <div className="relative w-full bg-gradient-to-br from-gray-900 to-black" style={{ height }}>
          {safeSlides.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate={index === i ? "center" : "exit"}
              transition={{
                x: { type: "spring", stiffness: 120, damping: 25 },
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
              }}
              className="absolute inset-0"
            >
              {src && (
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                  style={{
                    imageRendering: 'high-quality',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced navigation buttons with glossy effect */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 lg:px-12 z-20">
          <motion.button
            className="group w-14 h-14 sm:w-16 sm:h-16 rounded-full backdrop-blur-xl bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/25 transition-all duration-300 shadow-lg"
            onClick={prev}
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            className="group w-14 h-14 sm:w-16 sm:h-16 rounded-full backdrop-blur-xl bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/25 transition-all duration-300 shadow-lg"
            onClick={next}
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Enhanced indicators with glossy style */}
        {showIndicators && (
          <div className="absolute left-0 right-0 bottom-6 sm:bottom-10 flex justify-center gap-2.5 z-20 px-4">
            {safeSlides.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                className={`relative transition-all duration-300 ${
                  index === i 
                    ? "w-12 sm:w-16 h-1.5 bg-white/90 backdrop-blur-md" 
                    : "w-10 sm:w-12 h-1.5 bg-white/30 hover:bg-white/50 backdrop-blur-md"
                }`}
                style={{
                  borderRadius: '999px',
                  boxShadow: index === i 
                    ? '0 0 20px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.8)' 
                    : '0 2px 8px rgba(0,0,0,0.2)',
                }}
                whileHover={{ scale: 1.2, height: 8 }}
              >
                {/* Active indicator glow */}
                {index === i && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/30 blur-md"
                    animate={{ 
                      scale: [1, 1.5, 1], 
                      opacity: [0.5, 0, 0.5] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Slide counter */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
          <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-full px-4 py-2 text-white text-sm font-light"
               style={{
                 boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)'
               }}>
            <span className="font-medium">{index + 1}</span>
            <span className="mx-1.5 opacity-60">/</span>
            <span className="opacity-80">{safeSlides.length}</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [galleryForHome, setGalleryForHome] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  const heroTextRef = useRef(null);
  const programsRef = useRef(null);
  const youtubeRef = useRef(null);

  const isHeroTextInView = useInView(heroTextRef, { once: true, amount: 0.3 });
  const isProgramsInView = useInView(programsRef, { once: true, amount: 0.2 });
  const isYoutubeInView = useInView(youtubeRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Page loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadGalleryData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/event-photos");
        const text = await res.text().catch(() => "");
        let body;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }

        if (!res.ok) {
          console.warn("Failed to fetch gallery:", body || text);
          setIsLoading(false);
          return;
        }

        const rawSliderArr = (body && (body.slider || body.home_slider || [])) || [];
        const mapped = rawSliderArr
          .map((item) => {
            const url = getImgUrlSafe(item);
            return url;
          })
          .filter((u) => typeof u === "string" && u.trim().length > 0);

        if (mounted) setSlides(mapped);

        if (mounted) {
          let rawGallery = body.gallery ?? body ?? {};
          if (typeof rawGallery !== "object") rawGallery = {};
          const copy = { ...rawGallery };
          for (const key of ["home_slider", "homeSlider", "home-slider", "slider"]) {
            if (key in copy) delete copy[key];
          }
          setGalleryForHome(copy);
        }

        if (mounted) setIsLoading(false);
      } catch (e) {
        console.warn("Could not load gallery from dashboard:", e);
        if (mounted) setIsLoading(false);
      }
    }

    loadGalleryData();
    return () => {
      mounted = false;
    };
  }, []);

  const allYoutubeItems = Object.values(galleryForHome || {})
    .flat()
    .filter((item) => item?.youtube && item?.url)
    .map((item) => item.url);

  const programs = [
    { 
      title: "Education Support", 
      desc: "Literacy programs, skill development workshops, and scholarship programs to empower individuals through quality education.",
      icon: FaBookOpen,
    },
    { 
      title: "Healthcare Services", 
      desc: "Medical care, health awareness programs, and community health initiatives for elderly and underprivileged communities.",
      icon: FaStethoscope,
    },
    { 
      title: "Old Age Care", 
      desc: "Providing shelter, food, clothing, medical care, and support services for senior citizens in a safe nurturing environment.",
      icon: FaHandsHelping,
    },
  ];

  return (
    <>
      {/* External Loading Screen Component */}
      <AnimatePresence mode="wait">
        {pageLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Main Content */}
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

        {/* Hero carousel */}
        <motion.section style={{ opacity }} className="relative px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
          <div className="max-w-[1800px] mx-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60" 
                   style={{ 
                     height: "60vh", 
                     minHeight: "400px",
                     boxShadow: '0 20px 60px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                   }}>
                <motion.div
                  className="w-20 h-20 border-3 border-[#8B1A5A]/20 border-t-[#8B1A5A] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ filter: 'drop-shadow(0 0 10px rgba(139, 26, 90, 0.3))' }}
                />
              </div>
            ) : slides.length > 0 ? (
              <PhotoCarousel slides={slides} desktopHeight="80vh" />
            ) : (
              <div 
                className="flex justify-center items-center backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60"
                style={{ 
                  height: "60vh", 
                  minHeight: "400px",
                  boxShadow: '0 20px 60px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="text-center px-6">
                  <FaStar className="text-6xl text-[#8B1A5A]/30 mx-auto mb-6" 
                          style={{ filter: 'drop-shadow(0 4px 10px rgba(139, 26, 90, 0.2))' }} />
                  <p className="text-2xl text-[#8B1A5A]/70 font-light tracking-wide mb-3">No images uploaded yet</p>
                  <p className="text-base text-[#8B1A5A]/50 font-light">Please upload images from the dashboard</p>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Hero text - Refined elegance */}
        <motion.section 
          ref={heroTextRef}
          className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#8B1A5A]/30 to-transparent" 
               style={{ filter: 'drop-shadow(0 0 8px rgba(139, 26, 90, 0.3))' }} />
          
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isHeroTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-8 sm:space-y-12"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isHeroTextInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="inline-block"
                >
                  <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light" 
                        style={{ textShadow: '0 2px 10px rgba(139, 26, 90, 0.1)' }}>
                    Established Welfare Society
                  </span>
                  <div className="w-90 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5" 
                       style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.1] text-[#8B1A5A] tracking-tight" 
                    style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroTextInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    The Bharatheeya Seva
                  </motion.span>
                  <motion.span
                    className="block mt-3 font-serif text-[#FF69B4]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroTextInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    style={{ textShadow: '0 4px 20px rgba(255, 105, 180, 0.2)' }}
                  >
                    Welfare Society
                  </motion.span>
                </h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isHeroTextInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 1 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#8B1A5A]/90 font-light leading-relaxed">
                  Empowering Lives Through Education, Human Rights & Social Welfare
                </h2>
                
                <p className="text-base sm:text-lg text-[#8B1A5A]/70 max-w-3xl mx-auto leading-relaxed font-light">
                  A registered organization dedicated to promoting education, human rights, healthcare, women empowerment, and comprehensive social welfare programs across Andhra Pradesh.
                </p>
              </motion.div>

              {/* Refined CTA with glossy effects */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroTextInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <Link 
                  href="/donate" 
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white overflow-hidden rounded-full transition-all duration-500 hover:shadow-2xl"
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className="relative z-10 font-light tracking-wider uppercase text-sm">Support Our Cause</span>
                  <FaHandHoldingHeart className="relative z-10 text-lg" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF69B4] to-[#8B1A5A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-full" />
                </Link>

                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-3 px-10 py-4 backdrop-blur-md bg-white/20 border border-white/40 text-[#8B1A5A] hover:bg-white/30 rounded-full transition-all duration-300"
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <span className="font-light tracking-wider uppercase text-sm">Learn More</span>
                  <FaArrowRight className="text-sm" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* YouTube section - Glossy cards */}
        <section ref={youtubeRef} className="relative">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isYoutubeInView ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-16 sm:mb-20"
            >
              <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light">
                Visual Stories
              </span>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5 mb-8" 
                   style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#8B1A5A] mb-6" 
                  style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                Our Impact Stories
              </h2>
              
              <p className="text-lg text-[#8B1A5A]/70 max-w-2xl mx-auto font-light leading-relaxed">
                Watch how we're making a difference in communities across Andhra Pradesh
              </p>
            </motion.div>

            {allYoutubeItems.length === 0 ? (
              <div className="text-center py-20 backdrop-blur-md bg-white/30 border border-white/50 rounded-3xl" 
                   style={{ boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)' }}>
                <p className="text-lg text-[#8B1A5A]/60 font-light">No videos yet. Please add from dashboard.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {allYoutubeItems.slice(0, 6).map((url, idx) => {
                    let embed = url;
                    try {
                      const u = new URL(url);
                      if (u.hostname.includes("youtube.com")) {
                        const v = u.searchParams.get("v");
                        if (v) embed = `https://www.youtube.com/embed/${v}`;
                      } else if (u.hostname.includes("youtu.be")) {
                        const id = u.pathname.replace("/", "");
                        embed = `https://www.youtube.com/embed/${id}`;
                      }
                    } catch (e) {}

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isYoutubeInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className="group relative backdrop-blur-lg bg-white/40 rounded-2xl border border-white/60 overflow-hidden transition-all duration-500"
                        whileHover={{ y: -8 }}
                        style={{
                          boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                        
                        <div className="aspect-video overflow-hidden bg-black">
                          <iframe
                            title={`yt-${idx}`}
                            src={embed}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 backdrop-blur-sm bg-white/20 border-t border-white/40">
                          <div className="flex items-center justify-between">
                            <span className="text-[#8B1A5A]/80 font-light tracking-wider uppercase text-xs">Watch Video</span>
                            <FaPlay className="text-[#FF69B4] text-sm group-hover:translate-x-1 transition-transform" 
                                    style={{ filter: 'drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3))' }} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {allYoutubeItems.length > 6 && (
                  <div className="mt-16 text-center">
                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-3 px-10 py-4 backdrop-blur-md bg-white/20 border border-white/40 text-[#8B1A5A] hover:bg-white/30 rounded-full transition-all duration-300"
                      style={{
                        boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      <span className="font-light tracking-wider uppercase text-sm">View All Videos</span>
                      <FaArrowRight className="text-sm" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Programs section - Glossy glass cards */}
        <section ref={programsRef} className="relative py-20 sm:py-28 lg:py-36">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isProgramsInView ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-16 sm:mb-20"
            >
              <span className="text-sm tracking-[0.3em] uppercase text-[#8B1A5A]/60 font-light">
                What We Do
              </span>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent mx-auto mt-5 mb-8" 
                   style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#8B1A5A] mb-6" 
                  style={{ textShadow: '0 4px 20px rgba(139, 26, 90, 0.1)' }}>
                Our Key Programs
              </h2>
              
              <p className="text-lg text-[#8B1A5A]/70 max-w-3xl mx-auto font-light leading-relaxed">
                Comprehensive 24+ specialized wings designed to create lasting social impact
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {programs.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isProgramsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                    className="group relative backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-12 lg:p-14 transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -10 }}
                    style={{
                      boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
                         style={{ boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)' }} />

                    <motion.div
                      className="mb-8 inline-block"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="text-5xl text-[#8B1A5A] opacity-70 group-hover:opacity-100 transition-opacity" 
                            style={{ filter: 'drop-shadow(0 4px 10px rgba(139, 26, 90, 0.2))' }} />
                    </motion.div>

                    <h3 className="text-2xl sm:text-3xl font-light text-[#8B1A5A] mb-5 tracking-wide">
                      {p.title}
                    </h3>

                    <p className="text-base text-[#8B1A5A]/70 leading-relaxed font-light mb-8">
                      {p.desc}
                    </p>

                    <div className="inline-flex items-center gap-2 text-[#FF69B4] text-sm font-light tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Discover</span>
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={isProgramsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link 
                href="/programs" 
                className="relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white rounded-full transition-all duration-500 hover:shadow-2xl overflow-hidden"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(139, 26, 90, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <span className="relative z-10 font-light tracking-wider uppercase text-sm">View All Programs</span>
                <FaArrowRight className="relative z-10 text-sm" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-full pointer-events-none" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
