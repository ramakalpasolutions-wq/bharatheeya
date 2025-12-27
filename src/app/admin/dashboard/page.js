"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";
import alertCircle from "react-useanimations/lib/alertCircle";
import {
  FaFolder,
  FaUpload,
  FaTrash,
  FaEdit,
  FaImages,
  FaYoutube,
  FaHome,
  FaSignOutAlt,
  FaChevronRight,
  FaTimes,
  FaEye,
  FaCheck,
} from "react-icons/fa";

const API = "/api/event-photos";
const EXAMPLE_LOCAL_PATH = "/mnt/data/3b9d88d7-3ddd-44b0-b3e7-dad4e4e185b4.png";

export default function AdminPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // main form state
  const [eventName, setEventName] = useState("");
  const [files, setFiles] = useState([]);
  const [singleFile, setSingleFile] = useState(null);

  // galleries
  const [gallery, setGallery] = useState({});
  const [selectedEvent, setSelectedEvent] = useState("");
  const [heroGallery, setHeroGallery] = useState([]);

  // UI state
  const [useExisting, setUseExisting] = useState(true);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  // hero card state
  const [heroFiles, setHeroFiles] = useState([]);
  const [heroPreview, setHeroPreview] = useState(EXAMPLE_LOCAL_PATH);
  const [heroUploading, setHeroUploading] = useState(false);

  // YouTube input
  const [youtubeUrls, setYoutubeUrls] = useState("");

  // -----------------------
  // Helpers
  // -----------------------
  function getImgUrl(img) {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.original || img.optimized || img.thumb || "";
  }

  function safeSrc(img) {
    const s = getImgUrl(img);
    return s && s.trim() !== "" ? s : null;
  }

  function getHeroUrlSet(heroArr) {
    return new Set((heroArr || []).map(getImgUrl).filter(Boolean));
  }

  const allowedExts = [];
  function isValidImageFile(file) {
    if (!file) return false;
    if (file.type && !file.type.startsWith("image/")) return false;
    const name = (file.name || "").toLowerCase();
    if (allowedExts.length === 0) return true;
    return allowedExts.some((ext) => name.endsWith(ext));
  }

  const HERO_KEYS = new Set(["home_slider", "home-slider", "homeSlider"]);

  function updateStatus(message, type = "info") {
    setStatus(message);
    setStatusType(type);
  }

  // -----------------------
  // Auth check (client)
  // -----------------------
  useEffect(() => {
    setIsMounted(true);
    const logged = localStorage.getItem("isAdmin");
    if (!logged) router.push("/admin-login");
  }, [router]);

  // -----------------------
  // Load gallery + slider
  // -----------------------
  async function loadGallery() {
    try {
      const res = await fetch(API);
      const text = await res.text().catch(() => "");
      let body;
      try {
        body = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.error("loadGallery: invalid JSON:", parseErr, text);
        setGallery({});
        setHeroGallery([]);
        setSelectedEvent("");
        updateStatus("Error loading gallery: invalid server response", "error");
        return;
      }

      if (!res.ok) {
        const errMsg = body?.error || `Failed to load gallery (status ${res.status})`;
        throw new Error(errMsg);
      }

      const galleryFromBody = body.gallery ?? body;
      const sliderFromBody = body.slider ?? body.home_slider ?? body.homeSlider ?? [];

      const finalGallery =
        body.gallery ??
        (galleryFromBody.gallery
          ? galleryFromBody.gallery
          : typeof galleryFromBody === "object"
          ? galleryFromBody
          : {});

      setGallery(finalGallery || {});
      setHeroGallery(Array.isArray(sliderFromBody) ? sliderFromBody : []);
      setSelectedEvent("");
      updateStatus("", "info");
    } catch (err) {
      console.error("loadGallery error:", err);
      setGallery({});
      setHeroGallery([]);
      setSelectedEvent("");
      updateStatus("Error loading gallery: " + (err.message || String(err)), "error");
    }
  }

  useEffect(() => {
    if (isMounted) {
      loadGallery();
    }
  }, [isMounted]);

  // computed helpers for UI
  const heroUrlSet = getHeroUrlSet(heroGallery);
  const events = Object.keys(gallery)
    .filter((k) => !HERO_KEYS.has(k))
    .sort((a, b) => a.localeCompare(b));

  const safeCount = (ev) => {
    const list = gallery[ev] || [];
    return list.filter((img) => !heroUrlSet.has(getImgUrl(img))).length;
  };

  // -----------------------
  // Cloudinary direct upload helper
  // -----------------------
  async function uploadToCloudinary(file, folder) {
    const sigRes = await fetch(`/api/upload-signature?folder=${encodeURIComponent(folder)}`);
    if (!sigRes.ok) throw new Error("Failed to get upload signature");
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);
    fd.append("folder", folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });

    const json = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(json.error?.message || "Cloudinary upload failed");
    }
    return json;
  }

  // -----------------------
  // Upload images to an event (direct to Cloudinary)
  // -----------------------
  async function handleFilesUpload(e) {
    e?.preventDefault?.();
    const targetRaw = useExisting ? selectedEvent : eventName;
    const target = String(targetRaw || "").trim();
    if (!target) return alert("Please choose or enter an event name.");
    const toUpload = singleFile ? [singleFile] : files;
    if (!toUpload || toUpload.length === 0) return alert("Pick one or more images to upload.");

    const valid = toUpload.filter(isValidImageFile);
    const invalidCount = toUpload.length - valid.length;
    if (invalidCount > 0) {
      updateStatus(
        `Rejected ${invalidCount} file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    }
    if (valid.length === 0)
      return alert("No valid image files to upload. Allowed types: " + (allowedExts.join(", ") || "images"));

    updateStatus("Uploading to Cloudinary...", "info");
    try {
      const uploadedItems = [];
      let i = 1;
      for (const f of valid) {
        updateStatus(`Uploading ${i}/${valid.length}...`, "info");
        const uploadRes = await uploadToCloudinary(f, `events/${target}`);
        uploadedItems.push({
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
        });
        i++;
      }

      const metaRes = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaded: uploadedItems, eventName: target }),
      });

      const metaBody = await metaRes.json();
      if (!metaRes.ok) throw new Error(metaBody.error || "Failed to save metadata");

      if (metaBody.gallery) setGallery(metaBody.gallery);
      if (metaBody.slider) setHeroGallery(metaBody.slider);
      if (!metaBody.gallery && !metaBody.slider) await loadGallery();

      setSelectedEvent(target);
      setFiles([]);
      setSingleFile(null);
      setEventName("");
      updateStatus("Uploaded successfully", "success");
    } catch (err) {
      console.error("handleFilesUpload error:", err);
      updateStatus("Error: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // Rename event
  // -----------------------
  async function renameEvent() {
    if (!selectedEvent) return alert("Select an event to rename.");
    const current = selectedEvent;
    const suggested = current.replace(/_/g, " ");
    const newNameRaw = prompt(`Rename event "${suggested}" to:`, suggested);
    if (!newNameRaw) return;
    const newName = newNameRaw.trim();
    if (!newName) return alert("Please provide a non-empty name.");
    const newKey = newName.replace(/\s+/g, "_");

    updateStatus("Renaming event...", "info");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renameEvent: true, oldName: current, newName: newKey }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Server refused rename");
      setGallery(body.gallery || (await loadGallery()) || {});
      setSelectedEvent(newKey);
      updateStatus("Renamed successfully", "success");
    } catch (err) {
      updateStatus("Error renaming: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // delete entire event
  // -----------------------
  async function handleDeleteEvent(ev) {
    if (!ev) return alert("Select an event to delete.");
    if (HERO_KEYS.has(ev)) {
      return alert("Cannot delete the home slider here.");
    }
    if (!confirm(`Delete entire event '${ev}' and all its photos?`)) return;
    updateStatus("Deleting event...", "info");
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: ev, deleteEvent: true, hero: false }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Delete failed");
      setGallery(body.gallery || (await loadGallery()) || {});
      setHeroGallery(body.slider || body.home_slider || []);
      setSelectedEvent("");
      updateStatus(`Deleted ${ev}`, "success");
    } catch (err) {
      updateStatus("Error: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // delete single image
  // -----------------------
  async function deleteImageFromServer(event, url, opts = { hero: false }) {
    let targetUrl = typeof url === "string" && url.trim() ? url : null;

    if (!targetUrl && event && gallery[event] && Array.isArray(gallery[event])) {
      for (const it of gallery[event]) {
        const u = getImgUrl(it);
        if (u) {
          targetUrl = u;
          break;
        }
        if (it && it.url) {
          targetUrl = it.url;
          break;
        }
      }
    }

    if (!targetUrl && (opts.hero || HERO_KEYS.has(event))) {
      for (const it of heroGallery || []) {
        const u = getImgUrl(it);
        if (u) {
          targetUrl = u;
          break;
        }
        if (it && it.url) {
          targetUrl = it.url;
          break;
        }
      }
    }

    if (!targetUrl) {
      return alert("No image URL provided to delete.");
    }

    if (!confirm("Remove this image / link?")) return;

    updateStatus("Removing...", "info");
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: opts.hero ? "home_slider" : event,
          url: targetUrl,
          hero: !!opts.hero,
        }),
      });

      const text = await res.text().catch(() => "");
      let body;
      try {
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(body?.error || `Delete failed (status ${res.status})`);

      setGallery(body.gallery || (await loadGallery()) || {});
      setHeroGallery(body.slider || body.home_slider || []);
      updateStatus("Removed successfully", "success");
    } catch (err) {
      updateStatus("Error: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // hero upload
  // -----------------------
  async function handleHeroUpload() {
    if (!heroFiles || heroFiles.length === 0) return alert("Select hero images first.");
    const validHero = heroFiles.filter(isValidImageFile);
    const invalidHeroCount = heroFiles.length - validHero.length;
    if (invalidHeroCount > 0) {
      updateStatus(
        `Rejected ${invalidHeroCount} hero file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    }
    if (validHero.length === 0) return alert("No valid hero image files to upload.");
    setHeroUploading(true);
    updateStatus("Uploading hero images...", "info");
    try {
      const uploaded = [];
      let i = 1;
      for (const f of validHero) {
        updateStatus(`Uploading hero ${i}/${validHero.length}...`, "info");
        const uploadRes = await uploadToCloudinary(f, `slider`);
        uploaded.push({ url: uploadRes.secure_url, public_id: uploadRes.public_id });
        i++;
      }

      const metaRes = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaded, hero: true, eventName: "home_slider" }),
      });

      let metaBody = {};
      try {
        metaBody = await metaRes.json();
      } catch (e) {
        console.warn("handleHeroUpload: non-JSON response, reloading gallery", e);
        await loadGallery();
        setHeroFiles([]);
        setHeroPreview(EXAMPLE_LOCAL_PATH);
        updateStatus("Hero uploaded (server returned non-JSON)", "success");
        return;
      }

      if (!metaRes.ok) throw new Error(metaBody.error || "Hero metadata save failed");

      if (metaBody.slider || metaBody.home_slider) {
        setHeroGallery(metaBody.slider || metaBody.home_slider || []);
      } else {
        setGallery(metaBody.gallery || gallery);
        await loadGallery();
      }

      setHeroFiles([]);
      setHeroPreview(EXAMPLE_LOCAL_PATH);
      updateStatus("Hero uploaded successfully", "success");
    } catch (err) {
      updateStatus("Error: " + (err.message || String(err)), "error");
    } finally {
      setHeroUploading(false);
    }
  }

  function onHeroFilesChange(e) {
    const list = Array.from(e.target.files || []);
    const valid = list.filter(isValidImageFile);
    const rejected = list.length - valid.length;
    if (rejected > 0)
      updateStatus(
        `Rejected ${rejected} hero file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    setHeroFiles(valid);
    if (valid.length > 0) setHeroPreview(URL.createObjectURL(valid[0]));
  }

  function onSingleFileChange(e) {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setSingleFile(null);
      return;
    }
    if (!isValidImageFile(f)) {
      setSingleFile(null);
      updateStatus(
        "Invalid file selected. Allowed types: " + (allowedExts.join(", ") || "images"),
        "error"
      );
      return;
    }
    setSingleFile(f);
  }

  function onMultipleFilesChange(e) {
    const list = Array.from(e.target.files || []);
    const valid = list.filter(isValidImageFile);
    const rejected = list.length - valid.length;
    if (rejected > 0)
      updateStatus(
        `Rejected ${rejected} file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    setFiles(valid);
  }

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    router.push("/admin-login");
  }

  function handleResetForm() {
    setFiles([]);
    setSingleFile(null);
    updateStatus("", "info");
  }

  // -----------------------
  // Add YouTube folder/link
  // -----------------------
  async function addYoutubeFolder() {
    const nameRaw = (eventName || selectedEvent || "youtube").trim();
    if (!nameRaw) return alert("Provide a folder name or select an event.");
    const en = nameRaw;

    const rawInput = (youtubeUrls || "").trim();
    let urls = [];
    if (rawInput) {
      urls = rawInput
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (urls.length === 0) {
      const single = (prompt("Paste the YouTube URL:") || "").trim();
      if (!single) return alert("No URL provided.");
      urls = [single];
    }

    updateStatus(`Adding ${urls.length} YouTube link(s) to "${en}"...`, "info");

    const failures = [];
    let lastBody = null;

    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      try {
        const payload = { addYoutube: true, eventName: en, url: u };
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text().catch(() => "");
        let body;
        try {
          body = text ? JSON.parse(text) : {};
        } catch (e) {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(body?.error || `Failed to add URL (status ${res.status})`);
        }

        lastBody = body;
        updateStatus(`Added ${i + 1}/${urls.length}`, "info");
      } catch (err) {
        failures.push({ url: u, message: err.message || String(err) });
      }
    }

    try {
      if (lastBody) {
        const newGallery = lastBody.gallery ?? lastBody ?? {};
        setGallery(newGallery);
        setHeroGallery(lastBody.slider ?? lastBody.home_slider ?? heroGallery);
      } else {
        await loadGallery();
      }
    } catch (e) {
      console.warn("Failed to update gallery after YouTube posts:", e);
    }

    if (failures.length === 0) {
      updateStatus("YouTube link(s) added successfully", "success");
      setEventName("");
      setYoutubeUrls("");
    } else {
      updateStatus(`Added ${urls.length - failures.length}/${urls.length} — ${failures.length} failed`, "error");
    }
  }

  // -----------------------
  // YouTube helpers
  // -----------------------
  function parseYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      } else if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      return null;
    } catch (e) {
      const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    }
  }

  function youtubeThumbUrl(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  function isYoutubeFolder(ev) {
    const items = gallery[ev];
    return Array.isArray(items) && items.length > 0 && items[0]?.youtube === true;
  }

  function youTubeEmbedSrc(url) {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  const youtubeFolders = Object.entries(gallery).filter(
    ([k, items]) => Array.isArray(items) && items.length > 0 && items[0]?.youtube === true
  );

  // Status icon component
  const StatusIcon = () => {
    if (statusType === "success") return <FaCheck className="text-green-400" />;
    if (statusType === "error") return <UseAnimations animation={alertCircle} size={20} strokeColor="#f87171" />;
    return <UseAnimations animation={loading2} size={20} strokeColor="#f8d46a" />;
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF]">
        <div className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 text-center shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner">
          <UseAnimations animation={loading2} size={56} strokeColor="#f8d46a" />
          <div className="mt-4 text-[#8B1A5A] font-light">Loading...</div>
        </div>
      </div>
    );
  }

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF] p-4 sm:p-6 lg:p-8">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #8B1A5A 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="fixed top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#FF69B4]/10 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#8B1A5A]/10 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-8xl ml-9 mr-9 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 mb-6 shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light text-[#8B1A5A] mb-2">Admin Dashboard</h1>
              <div className="text-sm text-[#8B1A5A]/70 font-light">the_bharatheeya_seva_welfare_society — Event Photos Management</div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Status Bar */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 p-4 rounded-2xl flex items-center gap-3 ${
                  statusType === "success"
                    ? "bg-green-500/10 border-2 border-green-500/30"
                    : statusType === "error"
                    ? "bg-red-500/10 border-2 border-red-500/30"
                    : "bg-blue-500/10 border-2 border-blue-500/30"
                }`}
              >
                <StatusIcon />
                <span
                  className={`text-sm font-light ${
                    statusType === "success"
                      ? "text-green-700"
                      : statusType === "error"
                      ? "text-red-700"
                      : "text-blue-700"
                  }`}
                >
                  {status}
                </span>
                <motion.button
                  onClick={() => updateStatus("", "info")}
                  className="ml-auto text-[#8B1A5A]/50 hover:text-[#8B1A5A]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Upload Card */}
            <div className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8B1A5A]/20 to-[#FF69B4]/20">
                  <FaUpload className="text-2xl text-[#FF69B4]" />
                </div>
                <div>
                  <h2 className="text-xl font-light text-[#8B1A5A]">Upload Event Photos</h2>
                  <div className="text-sm text-[#8B1A5A]/70 font-light">Add images to existing or new events</div>
                </div>
              </div>

              <form onSubmit={handleFilesUpload} className="space-y-5">
                {/* Radio Buttons */}
                <div className="flex gap-4">
                  <motion.label
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      useExisting
                        ? "bg-gradient-to-r from-[#8B1A5A]/20 to-[#FF69B4]/20 border-2 border-[#FF69B4]"
                        : "bg-white/30 border-2 border-[#8B1A5A]/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      checked={useExisting}
                      onChange={() => setUseExisting(true)}
                      className="accent-[#FF69B4]"
                    />
                    <span className="text-[#8B1A5A] font-semibold">Use Existing</span>
                  </motion.label>

                  <motion.label
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      !useExisting
                        ? "bg-gradient-to-r from-[#8B1A5A]/20 to-[#FF69B4]/20 border-2 border-[#FF69B4]"
                        : "bg-white/30 border-2 border-[#8B1A5A]/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      checked={!useExisting}
                      onChange={() => setUseExisting(false)}
                      className="accent-[#FF69B4]"
                    />
                    <span className="text-[#8B1A5A] font-semibold">Create New</span>
                  </motion.label>
                </div>

                {/* Event Selection/Creation */}
                {useExisting ? (
                  <div>
                    <label className="block text-sm font-semibold text-[#8B1A5A]/80 mb-2">Select Event</label>
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-300"
                    >
                      <option value="">-- Select Event --</option>
                      {events.map((ev) => (
                        <option key={ev} value={ev}>
                          {ev.replace(/_/g, " ")} ({safeCount(ev)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-[#8B1A5A]/80 mb-2">New Event Name</label>
                    <input
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g. Annual Meeting 2025"
                      className="w-full px-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-300"
                    />
                  </div>
                )}

                {/* Single File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B1A5A]/80 mb-2">
                    Single Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSingleFileChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-[#8B1A5A] file:to-[#FF69B4] file:text-white file:font-semibold hover:file:cursor-pointer"
                  />
                </div>

                <div className="text-center">
                  <div className="text-[#FF69B4] font-bold">OR</div>
                </div>

                {/* Multiple Files Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B1A5A]/80 mb-2">
                    Multiple Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onMultipleFilesChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-[#8B1A5A] file:to-[#FF69B4] file:text-white file:font-semibold hover:file:cursor-pointer"
                  />
                  <div className="text-xs text-[#8B1A5A]/70 mt-2 font-light">{files.length} file(s) selected</div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    onClick={handleFilesUpload}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white font-bold shadow-2xl hover:shadow-[#FF69B4]/50 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUpload />
                    <span>Upload Photos</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={renameEvent}
                    className="px-6 py-3 rounded-full bg-white/50 border-2 border-[#8B1A5A]/30 text-[#8B1A5A] font-semibold hover:bg-[#8B1A5A]/20 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaEdit />
                    <span>Rename</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-3 rounded-full bg-white/50 border-2 border-[#8B1A5A]/30 text-[#8B1A5A] font-semibold hover:bg-[#8B1A5A]/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Gallery Section */}
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaImages className="text-2xl text-[#FF69B4]" />
                    <h3 className="text-xl font-light text-[#8B1A5A]">
                      {selectedEvent.replace(/_/g, " ")}
                    </h3>
                  </div>
                  <motion.button
                    onClick={() => setSelectedEvent("")}
                    className="p-2 rounded-lg bg-white/40 text-[#8B1A5A] hover:bg-red-500/20 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                {isYoutubeFolder(selectedEvent) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(gallery[selectedEvent] || []).map((item, i) => {
                      const url = item?.url || "";
                      const embed = youTubeEmbedSrc(url);
                      const title = item?.title || `Video ${i + 1}`;
                      return (
                        <div key={i} className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-[#8B1A5A]/20">
                          <div className="font-semibold text-[#8B1A5A] mb-3">{title}</div>
                          {embed ? (
                            <div className="relative" style={{ paddingTop: "56.25%" }}>
                              <iframe
                                src={embed}
                                title={title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                              <span className="text-sm text-gray-500">Invalid URL</span>
                            </div>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-[#FF69B4] hover:text-[#8B1A5A] underline flex items-center gap-1"
                            >
                              <FaYoutube />
                              <span>Open</span>
                            </a>
                            <button
                              onClick={() => deleteImageFromServer(selectedEvent, url)}
                              className="text-sm text-red-500 hover:text-red-700 underline flex items-center gap-1"
                            >
                              <FaTrash />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(gallery[selectedEvent] || [])
                      .filter((img) => !heroUrlSet.has(getImgUrl(img)))
                      .map((img, i) => {
                        const src = safeSrc(img);
                        const url = getImgUrl(img);
                        return (
                          <motion.div
                            key={i}
                            className="backdrop-blur-xl bg-white/30 rounded-2xl overflow-hidden border border-[#8B1A5A]/20"
                            whileHover={{ y: -5 }}
                          >
                            {src ? (
                              <img src={src} alt={`img-${i}`} className="w-full h-40 object-cover" />
                            ) : (
                              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-sm text-gray-500">No preview</span>
                              </div>
                            )}
                            <div className="p-3 flex items-center justify-between">
                              <a
                                href={src || url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-[#FF69B4] hover:text-[#8B1A5A] underline flex items-center gap-1"
                              >
                                <FaEye />
                                <span>View</span>
                              </a>
                              <button
                                onClick={() => deleteImageFromServer(selectedEvent, url)}
                                className="text-sm text-red-500 hover:text-red-700 underline flex items-center gap-1"
                              >
                                <FaTrash />
                                <span>Remove</span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT - Events List */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 h-fit shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaFolder className="text-xl text-[#FF69B4]" />
                <h3 className="text-lg font-light text-[#8B1A5A]">Events</h3>
              </div>
              {selectedEvent && (
                <motion.button
                  onClick={() => handleDeleteEvent(selectedEvent)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash />
                </motion.button>
              )}
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF69B4]/30 scrollbar-track-white/20">
              {events.length === 0 && (
                <div className="text-sm text-[#8B1A5A]/70 text-center py-8 font-light">No events yet</div>
              )}

              {events.map((ev) => (
                <motion.div
                  key={ev}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedEvent === ev
                      ? "bg-gradient-to-r from-[#8B1A5A]/20 to-[#FF69B4]/20 border-2 border-[#FF69B4]"
                      : "bg-white/30 border-2 border-[#8B1A5A]/20 hover:bg-[#8B1A5A]/10"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#8B1A5A]">{ev.replace(/_/g, " ")}</div>
                      <div className="text-xs text-[#8B1A5A]/70 mt-1 font-light">{safeCount(ev)} photos</div>
                    </div>
                    <FaChevronRight className={`text-[#FF69B4] transition-transform ${selectedEvent === ev ? 'rotate-90' : ''}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        </div>

        {/* Hero Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8B1A5A]/20 to-[#FF69B4]/20">
              <FaHome className="text-2xl text-[#FF69B4]" />
            </div>
            <div>
              <h3 className="text-xl font-light text-[#8B1A5A]">Home Carousel Images</h3>
              <div className="text-sm text-[#8B1A5A]/70 font-light">Upload images for the hero section on homepage</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Preview */}
            <div>
              <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden mb-4">
                {heroPreview ? (
                  <img src={heroPreview} className="w-full h-full object-cover" alt="hero preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 font-light">
                    No preview
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onHeroFilesChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-[#8B1A5A] file:to-[#FF69B4] file:text-white file:font-semibold hover:file:cursor-pointer mb-2"
              />

              <div className="text-xs text-[#8B1A5A]/70 mb-4 font-light">{heroFiles.length} file(s) selected</div>

              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleHeroUpload}
                  disabled={heroUploading}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: heroUploading ? 1 : 1.03, y: heroUploading ? 0 : -2 }}
                  whileTap={{ scale: heroUploading ? 1 : 0.98 }}
                >
                  <FaHome />
                  <span>{heroUploading ? "Uploading..." : "Upload to Carousel"}</span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setHeroFiles([]);
                    setHeroPreview(EXAMPLE_LOCAL_PATH);
                  }}
                  className="px-6 py-3 rounded-full bg-white/50 border-2 border-[#8B1A5A]/30 text-[#8B1A5A] font-semibold hover:bg-[#8B1A5A]/20 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset
                </motion.button>
              </div>
            </div>

            {/* Current Hero Images */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-light text-[#8B1A5A] mb-4">Current Hero Images</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {heroGallery.length === 0 && (
                  <div className="col-span-full text-center text-[#8B1A5A]/70 py-8 font-light">No hero images yet</div>
                )}

                {heroGallery.map((h, i) => {
                  const src = safeSrc(h);
                  const url = getImgUrl(h);
                  return (
                    <motion.div
                      key={i}
                      className="backdrop-blur-xl bg-white/30 rounded-2xl overflow-hidden border border-[#8B1A5A]/20"
                      whileHover={{ y: -5 }}
                    >
                      {src ? (
                        <img src={src} className="w-full h-32 object-cover" alt={`hero-${i}`} />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500 font-light">No preview</span>
                        </div>
                      )}
                      <div className="p-3 flex items-center justify-between">
                        <a
                          href={src || url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-[#FF69B4] hover:text-[#8B1A5A] underline flex items-center gap-1"
                        >
                          <FaEye />
                          <span>View</span>
                        </a>
                        <button
                          onClick={() => deleteImageFromServer("home_slider", url, { hero: true })}
                          className="text-sm text-red-500 hover:text-red-700 underline flex items-center gap-1"
                        >
                          <FaTrash />
                          <span>Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* YouTube Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-6 shadow-[0_20px_60px_0_rgba(139,26,90,0.15)] shadow-inner"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8B1A5A]/20 to-[#FF69B4]/20">
              <FaYoutube className="text-2xl text-[#FF69B4]" />
            </div>
            <div>
              <h3 className="text-xl font-light text-[#8B1A5A]">YouTube Videos</h3>
              <div className="text-sm text-[#8B1A5A]/70 font-light">Add YouTube links to events</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Folder name (or select an event)"
                className="flex-1 px-4 py-3 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-300"
              />
              <motion.button
                onClick={addYoutubeFolder}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white font-bold shadow-xl hover:shadow-[#FF69B4]/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Add YouTube
              </motion.button>
              <motion.button
                onClick={() => { setEventName(""); setYoutubeUrls(""); updateStatus("", "info"); }}
                className="px-6 py-3 rounded-full bg-white/50 border-2 border-[#8B1A5A]/30 text-[#8B1A5A] font-semibold hover:bg-[#8B1A5A]/20 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear
              </motion.button>
            </div>

            <textarea
              value={youtubeUrls}
              onChange={(e) => setYoutubeUrls(e.target.value)}
              placeholder="Paste one or more YouTube URLs (newline or comma separated)"
              className="w-full p-4 rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-300 resize-y min-h-[100px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {youtubeFolders.length === 0 && (
                <div className="col-span-full text-center text-[#8B1A5A]/70 py-8 font-light">No YouTube links yet</div>
              )}

              {youtubeFolders.map(([folder, items]) => {
                const url = items?.[0]?.url || "";
                const thumb = youtubeThumbUrl(url);
                return (
                  <motion.div
                    key={folder}
                    className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-[#8B1A5A]/20"
                    whileHover={{ y: -5 }}
                  >
                    <div className="font-semibold text-[#8B1A5A] mb-3">{folder.replace(/_/g, " ")}</div>
                    <div className="h-40 mb-3 rounded-lg overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={`yt-${folder}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-sm text-gray-500 font-light">No thumbnail</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 justify-between">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Open Link
                      </a>
                      <button
                        onClick={() => deleteImageFromServer(folder, url)}
                        className="px-4 py-2 bg-red-500/20 text-red-500 rounded-full text-sm font-semibold hover:bg-red-500/30 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
