// src/app/donate/page.js
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import copy from "react-useanimations/lib/copy";
import { FaUniversity, FaPhone, FaHandHoldingHeart, FaCheckCircle } from "react-icons/fa";

/* ---------------------------------------
   Inner component (client logic)
---------------------------------------- */
function DonateContent() {
  const searchParams = useSearchParams();
  const paramName = searchParams?.get("name") ?? "";
  const paramPhone = searchParams?.get("phone") ?? "";

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // copy state
  const [copiedField, setCopiedField] = useState("");

  // bank details
  const BANK = {
    accountName: "The Bharatheeya Seva Welfare Society",
    accountNumber: "1234567890",
    ifsc: "SBIN0000123",
    bankName: "State Bank of India",
    branch: "Guntur",
    upiId: "bharatheeyasevasamithi@sbi",
  };

  // Prefill from query params
  useEffect(() => {
    if (paramName) setName(paramName);
    if (paramPhone) setPhone(paramPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validatePhone(p) {
    return typeof p === "string" && p.replace(/[^0-9]/g, "").length >= 7;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!validatePhone(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    setSubmitted(true);

    alert(
      `Thank you ${name}! 🙏\n\nPlease scan the QR code on this page or use the bank details to complete your donation.`
    );
  }

  function copyToClipboard(text, field) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    });
  }

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
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#8B1A5A]/10 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
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
            className="inline-block mb-6"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <UseAnimations animation={heart} size={90} strokeColor="#FF69B4" />
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-6 bg-gradient-to-r from-[#8B1A5A] via-[#FF69B4] to-[#8B1A5A] bg-clip-text text-transparent"
            style={{ textShadow: "0 4px 20px rgba(255, 105, 180, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Support Our Mission
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#8B1A5A]/80 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your generosity helps Bharatheeya Seva create lasting change across communities in India.
          </motion.p>
        </motion.div>

        {/* Content grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* LEFT: QR Code Section */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 shadow-[0_8px_32px_0_rgba(139,26,90,0.15)]"
            style={{
              boxShadow: "0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaHandHoldingHeart className="text-4xl text-[#FF69B4]" />
              </motion.div>
              <h2 className="text-3xl font-light text-[#8B1A5A]">Donate via QR</h2>
            </div>

            {/* QR Code */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <motion.div
                className="relative p-6 rounded-3xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-md border-2 border-white/60"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  boxShadow: "0 20px 60px rgba(139, 26, 90, 0.2)",
                }}
              >
                <div className="bg-white p-4 rounded-2xl">
                  <img
                    src="/turst-logo.webp"
                    alt="Donate QR"
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </motion.div>

              <motion.p
                className="mt-6 text-md text-[#8B1A5A]/70 text-center font-light max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Scan using any UPI app to donate securely
              </motion.p>
            </motion.div>

            {/* Help Section */}
            <motion.div
              className="mt-8 pt-6 border-t border-[#8B1A5A]/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.a
                href="/contact"
                className="flex items-center justify-center gap-3 text-[#FF69B4] hover:text-[#8B1A5A] transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone className="text-xl" />
                <span>Need Help? Contact Us</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Bank Details */}
          <motion.aside
            variants={itemVariants}
            className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 shadow-[0_8px_32px_0_rgba(139,26,90,0.15)]"
            style={{
              boxShadow: "0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <FaUniversity className="text-4xl text-[#FF69B4]" />
              </motion.div>
              <h2 className="text-3xl font-light text-[#8B1A5A]">Bank Details</h2>
            </div>

            <div className="space-y-4">
              {[
                ["Account Name", BANK.accountName, "accountName"],
                ["Account Number", BANK.accountNumber, "accountNumber"],
                ["IFSC Code", BANK.ifsc, "ifsc"],
                ["UPI ID", BANK.upiId, "upiId"],
              ].map(([label, value, key], idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border border-white/40 flex justify-between items-center group hover:bg-white/60 transition-all duration-300"
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xl text-[#8B1A5A]/60 mb-1 font-light uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="font-mono text-[#8B1A5A] text-md md:text-base font-medium break-all">
                      {value}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => copyToClipboard(value, key)}
                    className="ml-4 p-3 rounded-xl bg-gradient-to-br from-[#8B1A5A]/10 to-[#FF69B4]/10 hover:from-[#8B1A5A]/20 hover:to-[#FF69B4]/20 transition-all flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {copiedField === key ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                        >
                          <FaCheckCircle className="text-green-500 text-xl" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <UseAnimations animation={copy} size={20} strokeColor="#8B1A5A" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#8B1A5A]/10 to-[#FF69B4]/10 border border-[#8B1A5A]/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="text-sm text-[#8B1A5A]/70 font-light text-center">
                <span className="font-semibold text-[#8B1A5A]">{BANK.bankName}</span>
                {" — "}
                <span>{BANK.branch} Branch</span>
              </div>
            </motion.div>
          </motion.aside>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/60 p-8 text-center"
          style={{
            boxShadow: "0 8px 32px 0 rgba(139, 26, 90, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <h3 className="text-2xl font-light text-[#8B1A5A] mb-4">
              Every Contribution Makes a Difference
            </h3>
            <p className="text-[#8B1A5A]/70 max-w-2xl mx-auto text-md font-light">
              Your donation directly supports our programs in education, healthcare, women empowerment, and community development across India.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

/* ---------------------------------------
   REQUIRED default export with Suspense
---------------------------------------- */
export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8CFCF] via-[#F5E6E8] to-[#E8CFCF]">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <UseAnimations animation={heart} size={60} strokeColor="#FF69B4" />
          </motion.div>
        </div>
      }
    >
      <DonateContent />
    </Suspense>
  );
}
