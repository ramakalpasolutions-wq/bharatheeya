"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";
import infinity from "react-useanimations/lib/infinity";
import plusToX from "react-useanimations/lib/plusToX";
import arrowDown from "react-useanimations/lib/arrowDown";
import searchToX from "react-useanimations/lib/searchToX";

export default function GalleryPage() {
  const [gallery, setGallery] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("photos"); // "photos" | "videos"

  // popup gallery viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [isYoutubeFolder, setIsYoutubeFolder] = useState(false);

  // lightbox with current index for navigation
  const [lightbox, setLightbox] = useState({
    open: false,
    src: "",
    alt: "",
    currentIndex: -1,
    totalImages: 0,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/event-photos");
        const text = await res.text().catch(() => "");
        let body = {};
        try {
          body = text ? JSON.parse(text) : {};
        } catch (e) {
          body = {};
        }

        if (!res.ok) throw new Error(body?.error || "Failed to load gallery");

        const raw = body.gallery ?? body ?? {};

        const cleaned = {};
        for (const [k, v] of Object.entries(raw)) {
          if (!v) continue;
          if (!Array.isArray(v)) continue;
          if (v.length === 0) continue;

          const filtered = v.filter((item) => {
            if (!item) return false;
            if (typeof item === "string") return item.trim() !== "";
            if (typeof item === "object") {
              if (item.youtube === true)
                return !!(item.url && String(item.url).trim());
              return !!(item.original || item.optimized || item.thumb);
            }
            return false;
          });

          if (filtered.length === 0) continue;
          cleaned[k] = filtered;
        }

        setGallery(cleaned);
      } catch (err) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ESC closes viewer/lightbox, arrows navigate lightbox
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        if (lightbox.open) {
          closeLightbox();
        } else if (viewerOpen) {
          closeEventViewer();
        }
      } else if (lightbox.open && lightbox.currentIndex >= 0) {
        if (e.key === "ArrowLeft" && lightbox.currentIndex > 0) {
          const prevSrc =
            typeof eventImages[lightbox.currentIndex - 1] === "string"
              ? eventImages[lightbox.currentIndex - 1]
              : eventImages[lightbox.currentIndex - 1]?.optimized ||
                eventImages[lightbox.currentIndex - 1]?.thumb ||
                eventImages[lightbox.currentIndex - 1]?.original ||
                "";
          setLightbox((prev) => ({
            ...prev,
            currentIndex: prev.currentIndex - 1,
            src: prevSrc,
          }));
        } else if (
          e.key === "ArrowRight" &&
          lightbox.currentIndex < lightbox.totalImages - 1
        ) {
          const nextSrc =
            typeof eventImages[lightbox.currentIndex + 1] === "string"
              ? eventImages[lightbox.currentIndex + 1]
              : eventImages[lightbox.currentIndex + 1]?.optimized ||
                eventImages[lightbox.currentIndex + 1]?.thumb ||
                eventImages[lightbox.currentIndex + 1]?.original ||
                "";
          setLightbox((prev) => ({
            ...prev,
            currentIndex: prev.currentIndex + 1,
            src: nextSrc,
          }));
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox.open, viewerOpen, lightbox.currentIndex, eventImages, lightbox.totalImages]);

  // helpers
  const rawKeys = Object.keys(gallery).sort((a, b) => a.localeCompare(b));

  // classify keys
  const youtubeKeys = rawKeys.filter((k) => {
    const items = gallery[k] || [];
    return items.length > 0 && items[0]?.youtube === true;
  });

  const imageKeys = rawKeys.filter((k) => {
    const items = gallery[k] || [];
    return !(items.length > 0 && items[0]?.youtube === true);
  });

  // search filter
  const filteredImageEvents = imageKeys.filter((ev) =>
    ev.replace(/_/g, " ").toLowerCase().includes(query.trim().toLowerCase())
  );

  const filteredYoutubeEvents = youtubeKeys.filter((ev) =>
    ev.replace(/_/g, " ").toLowerCase().includes(query.trim().toLowerCase())
  );

  // preview first useful image (skip youtube items)
  function previewSrc(items) {
    if (!items || items.length === 0) return null;
    for (const it of items) {
      if (!it) continue;
      if (typeof it === "string") return it;
      if (it.youtube === true) continue;
      const src = it.thumb || it.optimized || it.original || null;
      if (src && String(src).trim()) return src;
    }
    return null;
  }

  // YouTube helpers
  function parseYouTubeId(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      } else if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      return null;
    } catch (e) {
      const m = (url || "").match(
        /(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{6,})/
      );
      return m ? m[1] : null;
    }
  }
  function youtubeThumbUrl(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  function youTubeEmbedSrc(url) {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  // open event viewer
  function openEventViewer(ev) {
    const items = gallery[ev] || [];
    const isYT = items.length > 0 && items[0]?.youtube === true;

    setSelectedEvent(ev);

    if (isYT) {
      const embeds = items
        .map((it) => {
          if (!it) return null;
          const url = typeof it === "string" ? it : it.url || "";
          if (!url) return null;
          const embed = youTubeEmbedSrc(url) || null;
          return embed;
        })
        .filter(Boolean);

      setIsYoutubeFolder(true);
      setEventImages(embeds);
      setViewerOpen(true);
      document.body.style.overflow = "hidden";
      return;
    }

    const imageItems = items.filter((it) => it && it.youtube !== true);
    setIsYoutubeFolder(false);
    setEventImages(imageItems);
    setViewerOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeEventViewer() {
    setViewerOpen(false);
    setSelectedEvent(null);
    setEventImages([]);
    setIsYoutubeFolder(false);
    if (!lightbox.open) document.body.style.overflow = "";
  }

  // lightbox with navigation support
  function openLightbox(src, alt = "", index = 0) {
    setLightbox({
      open: true,
      src,
      alt,
      currentIndex: index,
      totalImages: eventImages.length,
    });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightbox({
      open: false,
      src: "",
      alt: "",
      currentIndex: -1,
      totalImages: 0,
    });
    if (!viewerOpen) document.body.style.overflow = "";
  }

  const totalPhotos = filteredImageEvents.length;
  const totalVideos = filteredYoutubeEvents.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl text-[#8B1A5A] lg:text-6xl font-serif font-bold mb-4">
            Event Gallery
          </h1>
          <p className="text-xl text-black">
            Explore our memorable moments & inspiring stories
          </p>
        </motion.div>

        {/* Search + counters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-[#8B1A5A]/30 bg-black/30 backdrop-blur-md text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] outline-none transition-all duration-300"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <UseAnimations
                    animation={searchToX}
                    size={28}
                    strokeColor="#8B1A5A"
                    reverse={query.length > 0}
                  />
                </div>
              </div>

              <motion.div
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#8B1A5A]/20 to-[#FF69B4]/20 border border-[#8B1A5A]/30"
                whileHover={{ scale: 1.05 }}
              >
                {loading ? (
                  <UseAnimations
                    animation={infinity}
                    size={24}
                    strokeColor="#FF69B4"
                  />
                ) : (
                  <span className="text-2xl">📊</span>
                )}
                <span className="text-sm font-semibold text-[#2B0F1C]">
                  {loading
                    ? "Loading…"
                    : `${totalPhotos} photo event${totalPhotos !== 1 ? "s" : ""} · ${totalVideos} video collection${totalVideos !== 1 ? "s" : ""}`}
                </span>
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 1, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-flex bg-black/40 border border-[#8B1A5A]/40 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setActiveTab("photos")}
              className={`relative px-5 sm:px-7 py-2 text-sm sm:text-base font-semibold rounded-full transition-all ${
                activeTab === "photos"
                  ? "text-white"
                  : "text-[#f5f5f1]/70 hover:text-[#f5f5f1]"
              }`}
            >
              {activeTab === "photos" && (
                <motion.span
                  layoutId="gallery-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] shadow-[0_0_20px_rgba(255,105,180,0.4)] -z-10"
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                />
              )}
              Photos
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`relative px-5 sm:px-7 py-2 text-sm sm:text-base font-semibold rounded-full transition-all ${
                activeTab === "videos"
                  ? "text-white"
                  : "text-[#f5f5f1]/70 hover:text-[#f5f5f1]"
              }`}
            >
              {activeTab === "videos" && (
                <motion.span
                  layoutId="gallery-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4b6b] to-[#ff9a5a] shadow-[0_0_20px_rgba(255,107,129,0.4)] -z-10"
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                />
              )}
              YouTube
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <UseAnimations animation={loading2} size={80} strokeColor="#8B1A5A" />
            <p className="mt-4 text-[#f5f5f1]/60">Loading events...</p>
          </motion.div>
        )}

        {/* Content by tab */}
        {!loading && (
          <>
            {/* Photos Tab */}
            {activeTab === "photos" && (
              <>
                {totalPhotos === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center"
                  >
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-2xl font-bold text-[#2B0F1C] mb-2">
                      No photo events found
                    </h3>
                    <p className="text-[#2B0F1C]/60">
                      {query
                        ? "Try adjusting your search"
                        : "Photo galleries will appear here once added."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {filteredImageEvents.map((ev) => {
                      const items = gallery[ev] || [];
                      const label = ev.replace(/_/g, " ");
                      const rep = previewSrc(items);

                      return (
                        <motion.section
                          key={ev}
                          variants={cardVariants}
                          className="glass-card hover-lift p-6 group flex flex-col"
                          whileHover={{ y: -8 }}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <motion.div
                                className="text-3xl"
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: 3,
                                }}
                              >
                                📁
                              </motion.div>
                              <div>
                                <h2 className="text-lg md:text-xl font-bold text-[#f5f5f1] group-hover:text-[#FF69B4] transition-colors">
                                  {label}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-[#f5f5f1]/70">
                                    {items.length} photo
                                    {items.length !== 1 ? "s" : ""}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-[#8B1A5A]" />
                                  <span className="text-[11px] text-[#2B0F1C]/60">
                                    Image Gallery
                                  </span>
                                </div>
                              </div>
                            </div>

                            <motion.button
                              onClick={() => openEventViewer(ev)}
                              className="btn-glass flex items-center gap-2 justify-center text-xs px-3 py-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="font-semibold">Open</span>
                              <UseAnimations
                                animation={arrowDown}
                                size={18}
                                strokeColor="#000"
                              />
                            </motion.button>
                          </div>

                          <div className="relative overflow-hidden rounded-xl border-2 border-[#8B1A5A]/20 group-hover:border-[#FF69B4]/40 transition-all duration-300 mt-auto">
                            {rep ? (
                              <motion.img
                                src={rep}
                                className="w-full h-40 md:h-48 object-cover"
                                alt={`${label} preview`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                              />
                            ) : (
                              <div className="w-full h-40 md:h-48 flex flex-col items-center justify-center bg-black/20 text-[#f5f5f1]/40">
                                <div className="text-4xl mb-2">🖼️</div>
                                <span className="text-xs">
                                  No Preview Available
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </motion.section>
                      );
                    })}
                  </motion.div>
                )}
              </>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <>
                {totalVideos === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center"
                  >
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-2xl font-bold text-[#2B0F1C] mb-2">
                      No video collections found
                    </h3>
                    <p className="text-[#2B0F1C]/60">
                      {query
                        ? "Try searching with a different name"
                        : "YouTube collections will appear here once configured."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {filteredYoutubeEvents.map((ev) => {
                      const items = gallery[ev] || [];
                      const label = ev.replace(/_/g, " ");
                      const firstUrl = (() => {
                        const it = items[0];
                        if (!it) return "";
                        return typeof it === "string" ? it : it.url || "";
                      })();
                      const thumb = youtubeThumbUrl(firstUrl);

                      return (
                        <motion.section
                          key={ev}
                          variants={cardVariants}
                          className="glass-card hover-lift p-6 group flex flex-col border-2 border-red-500/25"
                          whileHover={{ y: -8 }}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <motion.div
                                className="text-3xl"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                🎥
                              </motion.div>
                              <div>
                                <h2 className="text-lg md:text-xl font-bold text-[#000000] group-hover:text-red-400 transition-colors">
                                  {label}
                                </h2>
                              </div>
                            </div>

                            <motion.button
                              onClick={() => openEventViewer(ev)}
                              className="px-4 py-2 rounded-full bg-[#8B1A5A] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Watch</span>
                              <UseAnimations
                                animation={arrowDown}
                                size={18}
                                strokeColor="#ffffff"
                              />
                            </motion.button>
                          </div>

                          <div className="relative overflow-hidden rounded-xl border-2 border-red-500/30 group-hover:border-red-400/50 transition-all duration-300 mt-auto">
                            {thumb ? (
                              <motion.div
                                onClick={() => openEventViewer(ev)}
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                              >
                                <img
                                  src={thumb}
                                  className="w-full h-40 md:h-48 object-cover"
                                  alt={`${label} preview`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                    <svg
                                      className="w-6 h-6 text-white ml-1"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="w-full h-40 md:h-48 flex flex-col items-center justify-center bg-black/20 text-[#f5f5f1]/40">
                                <div className="text-4xl mb-2">📺</div>
                                <span className="text-xs">
                                  No Thumbnail Available
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.section>
                      );
                    })}
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* POPUP EVENT VIEWER */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={closeEventViewer}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card max-w-7xl w-full max-h-[90vh] overflow-auto p-6 md:p-8 border-2 border-[#8B1A5A]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#8B1A5A]/20">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold animated-text">
                    {selectedEvent?.replace(/_/g, " ")}
                  </h2>
                  <p className="text-sm text-[#f5f5f1]/70 mt-1">
                    {eventImages.length} {isYoutubeFolder ? "video" : "photo"}
                    {eventImages.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <motion.button
                  onClick={closeEventViewer}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UseAnimations
                    animation={plusToX}
                    size={24}
                    strokeColor="#ff6b6b"
                    reverse={true}
                  />
                  <span>Close</span>
                </motion.button>
              </div>

              {/* Content */}
              {isYoutubeFolder ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {eventImages.map((embedUrl, idx) => (
                    <motion.div
                      key={idx}
                      variants={cardVariants}
                      className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[#8B1A5A]/30 shadow-2xl group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <iframe
                        title={`yt-${selectedEvent}-${idx}`}
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; autoplay"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {eventImages.map((img, i) => {
                    const src =
                      typeof img === "string"
                        ? img
                        : img.optimized || img.thumb || img.original || "";
                    return (
                      <motion.button
                        key={i}
                        variants={cardVariants}
                        onClick={() => openLightbox(src, `photo-${i}`, i)}
                        className="relative group overflow-hidden rounded-xl border-2 border-[#8B1A5A]/20 hover:border-[#FF69B4]/60 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={src}
                          className="w-full h-40 object-cover"
                          alt={`photo-${i}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-3xl">🔍</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-screen-xl w-full max-h-[95vh] overflow-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.totalImages > 1 && (
                <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                  <span className="text-white/80 text-sm pointer-events-none">
                    {lightbox.currentIndex + 1} / {lightbox.totalImages}
                  </span>
                </div>
              )}

              <motion.button
                onClick={closeLightbox}
                className="flex items-center gap-2 px-4 py-2 absolute top-4 right-4 z-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 border border-white/10 text-white font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <UseAnimations
                  animation={plusToX}
                  size={24}
                  strokeColor="#ffffff"
                  reverse={true}
                />
                <span>Close</span>
              </motion.button>

              <motion.img
                key={lightbox.src}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={lightbox.src}
                alt={lightbox.alt || "photo"}
                className="w-full h-auto rounded-2xl border-4 border-[#8B1A5A]/30 shadow-2xl max-h-[85vh] max-w-full"
                style={{ objectFit: "contain" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
