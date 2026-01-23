"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Share2, X, Copy, Check, Download } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import type { DailyIntention, JournalEntry, PersonalTask } from "@/types/routine";

interface CompletionScreenProps {
  intention: DailyIntention;
  journal: JournalEntry;
  tasks: PersonalTask[];
  startedAt: string | null;
  completedAt: string | null;
  onReset: () => void;
}

interface ShareData {
  feeling?: string;
  goal?: string;
  affirmation?: string;
  tasksCompleted: number;
  totalTasks: number;
  duration: number;
}

export function CompletionScreen({
  intention,
  journal,
  tasks,
  startedAt,
  completedAt,
  onReset,
}: CompletionScreenProps) {
  const t = useTranslations("completion");
  const tStep2 = useTranslations("steps.step2");
  const locale = useLocale();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const completedTasks = tasks.filter((t) => t.completed).length;

  const getDurationMinutes = (): number => {
    if (!startedAt || !completedAt) return 0;
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / 60000);
  };

  const getDuration = () => {
    const mins = getDurationMinutes();
    if (mins === 0) return "N/A";
    return `${mins} ${t("minutes")}`;
  };

  const generateShareUrl = (): string => {
    const shareData: ShareData = {
      feeling: intention.feeling || undefined,
      goal: intention.goal || undefined,
      affirmation: intention.affirmation || undefined,
      tasksCompleted: completedTasks,
      totalTasks: tasks.length,
      duration: getDurationMinutes(),
    };

    const encoded = btoa(JSON.stringify(shareData));
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://goldenroutine.app";
    return `${baseUrl}/${locale}/share?d=${encoded}`;
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const url = generateShareUrl();
    const text = `
🌅 Morning Golden Time Complete!

✨ Feeling: ${intention.feeling ? tStep2(`feelings.${intention.feeling}`) : "Not set"}
🎯 Goal: ${intention.goal || "Not set"}
💪 Tasks: ${completedTasks}/${tasks.length}
⏱️ Duration: ${getDuration()}

#MorningGoldenTime #GoldenRoutine
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({ text, url });
      } catch {
        // User cancelled or error
      }
    }
  };

  const handleSaveQR = useCallback(async () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    // Create a new canvas with padding and branding
    const padding = 32;
    const brandingHeight = 48;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width + padding * 2;
    newCanvas.height = canvas.height + padding * 2 + brandingHeight;

    const ctx = newCanvas.getContext("2d");
    if (!ctx) return;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw QR code
    ctx.drawImage(canvas, padding, padding);

    // Add branding text
    ctx.fillStyle = "#d4a843";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Golden Routine", newCanvas.width / 2, canvas.height + padding + 32);

    // Convert to blob
    newCanvas.toBlob(async (blob) => {
      if (!blob) return;

      const fileName = `golden-routine-${new Date().toISOString().split("T")[0]}.png`;

      // Try native share with file (works on mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: "image/png" });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            return;
          } catch {
            // Fall through to download
          }
        }
      }

      // Fallback: download the image
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, "image/png");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen p-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mt-12 mb-8"
      >
        <div className="relative">
          <motion.div
            className="text-8xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌟
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-golden-400" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-gray-800 text-center mb-2"
      >
        {t("title")}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 text-center mb-8"
      >
        {t("subtitle")}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
      >
        <h2 className="font-semibold text-gray-800 mb-4">{t("summary.title")}</h2>

        <div className="space-y-4">
          {intention.feeling && (
            <div className="flex items-start gap-3">
              <span className="text-xl">💛</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.feeling")}</div>
                <div className="font-medium text-gray-800">{tStep2(`feelings.${intention.feeling}`)}</div>
              </div>
            </div>
          )}

          {intention.goal && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.goal")}</div>
                <div className="font-medium text-gray-800">{intention.goal}</div>
              </div>
            </div>
          )}

          {intention.affirmation && (
            <div className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.affirmation")}</div>
                <div className="font-medium text-gray-800 italic">&quot;{intention.affirmation}&quot;</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-xl">💪</span>
            <div>
              <div className="text-xs text-gray-500">{t("summary.tasksCompleted")}</div>
              <div className="font-medium text-gray-800">{completedTasks}/{tasks.length}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">⏱️</span>
            <div>
              <div className="text-xs text-gray-500">{t("duration")}</div>
              <div className="font-medium text-gray-800">{getDuration()}</div>
            </div>
          </div>

          {journal.gratitude.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xl">💖</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.gratitude")}</div>
                <ul className="text-sm text-gray-700">
                  {journal.gratitude.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-4 w-full max-w-md mb-6"
      >
        <p className="text-center text-gray-600 italic">
          &quot;{t("quote")}&quot;
        </p>
        <p className="text-center text-sm text-gray-400 mt-1">- {t("quoteAuthor")}</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-md space-y-3"
      >
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          {t("shareButton")}
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 rounded-full font-medium text-gray-600 flex items-center justify-center gap-2 hover:bg-white/50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t("resetButton")}
        </button>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{t("shareButton")}</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                  <QRCodeCanvas
                    value={generateShareUrl()}
                    size={180}
                    level="M"
                    includeMargin={false}
                    fgColor="#1f2937"
                  />
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mb-4">
                {t("share.scanQR")}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="py-3 rounded-xl font-medium bg-gray-100 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      {t("share.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t("share.copyLink")}
                    </>
                  )}
                </button>

                {/* Save QR Button */}
                <button
                  onClick={handleSaveQR}
                  className="py-3 rounded-xl font-medium bg-gray-100 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      {t("share.saved")}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {t("share.saveQR")}
                    </>
                  )}
                </button>
              </div>

              {/* Native Share Button (mobile) */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t("share.shareNative")}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
