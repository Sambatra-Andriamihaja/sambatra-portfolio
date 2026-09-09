"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE, SPRING } from "@/lib/motion";
import { Close } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Diploma lightbox. Click to toggle a 2× loupe that tracks the pointer,
 * so a scanned document can actually be read. Replaces the modal library
 * and the image-zoom library with about sixty lines.
 */
export function DiplomaViewer({
  open,
  src,
  label,
  onClose,
}: {
  open: boolean;
  src?: string;
  label?: string;
  onClose: () => void;
}) {
  const t = useTranslations("About.Educations");
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  useEffect(() => {
    if (!open) {
      setZoom(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && src && (
        <div className="fixed inset-0 z-[95] grid place-items-center p-4 sm:p-8">
          <motion.button
            type="button"
            aria-label={t("closeDiploma")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE.expo }}
            className="absolute inset-0 cursor-zoom-out bg-canvas/85 backdrop-blur-xl"
          />

          <motion.figure
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={SPRING}
            className="relative max-h-full w-full max-w-4xl overflow-hidden rounded-2xl bg-surface shadow-lift ring-1 ring-inset ring-line"
          >
            <div>
              <figcaption className="flex items-center gap-3 border-b border-line px-4 py-3">
                <span className="truncate font-sans text-[0.8rem] text-muted">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t("closeDiploma")}
                  className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors duration-400 hocus:bg-ink/10 hocus:text-ink"
                >
                  <Close />
                </button>
              </figcaption>

              <div
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setOrigin(
                    `${((e.clientX - r.left) / r.width) * 100}% ${
                      ((e.clientY - r.top) / r.height) * 100
                    }%`,
                  );
                }}
                onClick={() => setZoom((z) => !z)}
                className={cn(
                  "relative aspect-[1/1.35] max-h-[72vh] w-full overflow-hidden bg-[rgb(var(--c-inset))]",
                  zoom ? "cursor-zoom-out" : "cursor-zoom-in",
                )}
              >
                <Image
                  src={src}
                  alt={label ?? ""}
                  fill
                  sizes="(max-width: 1024px) 92vw, 900px"
                  className="object-contain transition-transform duration-700 ease-expo"
                  style={{
                    transformOrigin: origin,
                    transform: zoom ? "scale(2.1)" : "scale(1)",
                  }}
                />
              </div>
            </div>
          </motion.figure>
        </div>
      )}
    </AnimatePresence>
  );
}
