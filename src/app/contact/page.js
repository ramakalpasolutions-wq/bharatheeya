"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import mail from "react-useanimations/lib/mail";
import loading2 from "react-useanimations/lib/loading2";
import checkBox from "react-useanimations/lib/checkBox";
import alertCircle from "react-useanimations/lib/alertCircle";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({
        type: "success",
        message: data.message || "Message sent successfully! We'll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again.",
      });

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    }
  }

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      label: "Registered Office",
      value: "D.No 12-128, Opp. Govt Hospital, Revenue Ward No. 14, Addanki, Bapatla District, Andhra Pradesh - 523201",
      link: "https://www.google.com/maps?q=12-128,+OPP+GOVT+HOSPITAL,+ADDANKI,+Bapatla,+Andhra+Pradesh,+523201",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: "contact@bharatheeyaseva.org",
      link: "mailto:contact@bharatheeyaseva.org",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FaPhone,
      label: "President - M L Subrahmanyam",
      value: "+91 XXXXX XXXXX",
      link: "tel:+91",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp Updates",
      value: "Get notifications & support via WhatsApp",
      link: "https://wa.me/91XXXXXXXXXX?text=Hello%2C%20I%20want%20to%20know%20about%20Bharatheeya%20Seva%20programs",
      color: "from-green-400 to-emerald-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF] py-12 sm:py-20 overflow-hidden">
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

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-16"
        >
          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className="inline-block"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <UseAnimations animation={mail} size={100} strokeColor="#FF69B4" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-6 bg-gradient-to-r from-[#8B1A5A] via-[#FF69B4] to-[#8B1A5A] bg-clip-text text-transparent"
            style={{ textShadow: "0 4px 20px rgba(255, 105, 180, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Contact Us
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#8B1A5A]/80 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Reach out for partnership, volunteering, or questions. We will respond as soon as possible.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 shadow-[0_8px_32px_0_rgba(139,26,90,0.15)]"
            style={{
              boxShadow: "0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
            }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#8B1A5A] mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-md font-light text-[#8B1A5A]/80 mb-2">
                  Name *
                </label>
                <motion.input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  whileFocus={{ scale: 1.01 }}
                  className="w-full rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 px-5 py-4 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Your name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-md font-light text-[#8B1A5A]/80 mb-2">
                  Email *
                </label>
                <motion.input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  whileFocus={{ scale: 1.01 }}
                  className="w-full rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 px-5 py-4 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-md font-light text-[#8B1A5A]/80 mb-2">
                  Message *
                </label>
                <motion.textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  whileFocus={{ scale: 1.01 }}
                  className="w-full rounded-2xl bg-white/50 border-2 border-[#8B1A5A]/20 px-5 py-4 text-[#8B1A5A] placeholder:text-[#8B1A5A]/40 outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20 transition-all duration-300 resize-none backdrop-blur-sm"
                  placeholder="How can we help you?"
                />
              </motion.div>

              {/* Status Messages */}
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 ${
                      status.type === "success"
                        ? "bg-green-500/20 border-2 border-green-500/40 text-green-700"
                        : status.type === "error"
                        ? "bg-red-500/20 border-2 border-red-500/40 text-red-700"
                        : "bg-purple-500/20 border-2 border-purple-500/40 text-purple-700"
                    }`}
                  >
                    {status.type === "loading" && (
                      <UseAnimations animation={loading2} size={24} strokeColor="#a855f7" />
                    )}
                    {status.type === "success" && (
                      <UseAnimations animation={checkBox} size={24} strokeColor="#22c55e" />
                    )}
                    {status.type === "error" && (
                      <UseAnimations animation={alertCircle} size={24} strokeColor="#ef4444" />
                    )}
                    <span className="text-sm font-medium">{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="flex-1 px-8 py-4 rounded-full bg-gradient-to-r from-[#8B1A5A] to-[#FF69B4] text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={{ scale: status.type === "loading" ? 1 : 1.05 }}
                  whileTap={{ scale: status.type === "loading" ? 1 : 0.95 }}
                  style={{
                    boxShadow: "0 10px 30px rgba(139, 26, 90, 0.3)",
                  }}
                >
                  {status.type === "loading" ? (
                    <>
                      <UseAnimations animation={loading2} size={24} strokeColor="#fff" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <UseAnimations animation={mail} size={24} strokeColor="#fff" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                <motion.a
                  href="/donate"
                  className="px-8 py-4 rounded-full border-2 border-[#8B1A5A] text-[#8B1A5A] font-semibold text-lg hover:bg-[#8B1A5A]/10 transition-all duration-300 text-center"
                  whileHover={{ scale: 1.05, borderColor: "#FF69B4", color: "#FF69B4" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Donate
                </motion.a>
              </div>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div variants={itemVariants} className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-light text-[#8B1A5A] mb-8">
              Get in Touch
            </h2>

            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={idx}
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
                  className="backdrop-blur-2xl bg-white/40 rounded-2xl border border-white/60 p-6 flex items-start gap-5 group hover:bg-white/50 transition-all duration-300"
                  style={{
                    boxShadow: "0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
                  }}
                  whileHover={{ x: 8, y: -5 }}
                >
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${info.color} blur-xl opacity-40 group-hover:opacity-70 transition-opacity`}
                    />
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-md border border-white/60">
                      <Icon className="text-2xl text-[#FF69B4]" />
                    </div>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xl text-[#8B1A5A]/70 mb-2 font-light">{info.label}</div>
                    <div className="text-[#8B1A5A] font-medium group-hover:text-[#FF69B4] transition-colors text-md leading-relaxed break-words">
                      {info.value}
                    </div>
                  </div>
                </motion.a>
              );
            })}

            {/* Why Contact Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="backdrop-blur-2xl bg-white/40 rounded-2xl border border-white/60 p-6 mt-6"
              style={{
                boxShadow: "0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
              }}
            >
              <h3 className="text-xl font-semibold text-[#8B1A5A] mb-5">Why Contact Us?</h3>
              <ul className="space-y-3 text-[#8B1A5A]/80">
                {[
                  "Volunteer programs across any wings",
                  "Donation and funding inquiries",
                  "Program information and membership",
                  "General questions about our society",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + idx * 0.1 }}
                    whileHover={{ x: 8 }}
                  >
                    <span className="text-[#FF69B4] text-xl flex-shrink-0">✓</span>
                    <span className="font-light">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Executive Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="backdrop-blur-2xl bg-white/40 rounded-2xl border border-white/60 p-6"
              style={{
                boxShadow: "0 4px 16px 0 rgba(139, 26, 90, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
              }}
            >
              <h3 className="text-xl font-semibold text-[#8B1A5A] mb-4">Executive Body</h3>
              <div className="space-y-2 text-sm text-[#8B1A5A]/80 font-light">
                <p>
                  <strong className="text-[#FF69B4] font-semibold">President:</strong> M L Subrahmanyam
                </p>
                <p>
                  <strong className="text-[#FF69B4] font-semibold">Secretary:</strong> Manchalla Hymavathi
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Location Map */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.8, type: "spring" }}
          className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 shadow-[0_8px_32px_0_rgba(139,26,90,0.15)]"
          style={{
            boxShadow: "0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#8B1A5A] mb-8 text-center">
            Find Us Here
          </h2>
          <motion.div
            className="rounded-2xl overflow-hidden border-2 border-[#8B1A5A]/30"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <iframe
              src="https://www.google.com/maps?q=12-128,+OPP+GOVT+HOSPITAL,+ADDANKI,+Bapatla,+Andhra+Pradesh,+523201&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Bharatheeya Seva Welfare Society Location"
            ></iframe>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
