"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PROFILE } from "@/constants/profile";
import { Check, Close, Copy, Mail, Send } from "@/components/ui/icon";
import { useHireMe } from "./hire-context";

type Form = { name: string; email: string; subject: string; message: string };
const EMPTY: Form = { name: "", email: "", subject: "", message: "" };

const SUBJECTS = [
  "freelance",
  "consulting",
  "automation",
  "fulltime",
  "other",
] as const;

/**
 * Floating "Hire me" button and contact sheet. The paper plane flies off
 * the button when pressed, the sheet springs in, and submitting composes
 * a ready-to-send email in the visitor's mail app — no backend required.
 */
export function HireMe() {
  const t = useTranslations("HireMe");
  const { isOpen: open, open: setOpenTrue, close: setOpenFalse } = useHireMe();
  const setOpen = useCallback(
    (v: boolean) => (v ? setOpenTrue() : setOpenFalse()),
    [setOpenTrue, setOpenFalse],
  );
  const [form, setForm] = useState<Form>(EMPTY);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      setSent(false);
      setForm(EMPTY);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setForm(EMPTY);
    }, 300);
  };

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${t(`subjects.${form.subject || "other"}`)} — ${form.name}`;
    const body = `${form.message}\n\n— ${form.name}\n${form.email}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const field = "field";

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[96] flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label={t("close")}
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 cursor-default bg-canvas/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label={t("title")}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="win relative max-h-[90vh] w-full max-w-lg overflow-y-auto"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <Close />
              </button>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center py-8 text-center"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-ok/15 text-ok"
                      >
                        <Check className="text-[2rem]" />
                      </motion.span>
                      <h3 className="text-xl font-bold text-ink">
                        {t("successTitle")}
                      </h3>
                      <p className="mt-2 max-w-xs text-sm text-muted">
                        {t("successMessage")}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={copy}
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-line transition-colors hover:bg-ink/5"
                        >
                          {copied ? <Check className="text-ok" /> : <Copy />}
                          {copied ? t("copied") : PROFILE.email}
                        </button>
                        <button
                          type="button"
                          onClick={close}
                          className="rounded-lg bg-indigo px-6 py-2.5 text-sm font-medium text-onIndigo transition-colors hover:bg-indigoDark"
                        >
                          {t("close")}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-ink">
                          {t("title")}
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                          {t("description")}
                        </p>
                      </div>

                      <form onSubmit={submit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="hire-name"
                            className="mb-1.5 block text-xs font-medium text-muted"
                          >
                            {t("nameLabel")}
                          </label>
                          <input
                            id="hire-name"
                            required
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder={t("namePlaceholder")}
                            className={field}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="hire-email"
                            className="mb-1.5 block text-xs font-medium text-muted"
                          >
                            {t("emailLabel")}
                          </label>
                          <input
                            id="hire-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            className={field}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="hire-subject"
                            className="mb-1.5 block text-xs font-medium text-muted"
                          >
                            {t("subjectLabel")}
                          </label>
                          <select
                            id="hire-subject"
                            required
                            value={form.subject}
                            onChange={(e) => set("subject", e.target.value)}
                            className={cn(
                              field,
                              "appearance-none",
                              !form.subject && "text-faint/70",
                            )}
                          >
                            <option value="" disabled>
                              {t("subjectPlaceholder")}
                            </option>
                            {SUBJECTS.map((s) => (
                              <option key={s} value={s} className="text-ink">
                                {t(`subjects.${s}`)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="hire-message"
                            className="mb-1.5 block text-xs font-medium text-muted"
                          >
                            {t("messageLabel")}
                          </label>
                          <textarea
                            id="hire-message"
                            required
                            rows={4}
                            value={form.message}
                            onChange={(e) => set("message", e.target.value)}
                            placeholder={t("messagePlaceholder")}
                            className={cn(field, "resize-none")}
                          />
                        </div>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo to-indigoLight px-6 py-3 text-sm font-semibold text-onIndigo shadow-lg shadow-indigo/25 transition-shadow hover:shadow-xl hover:shadow-indigo/35"
                        >
                          <Send className="text-[1rem]" />
                          {t("send")}
                        </motion.button>
                        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-faint">
                          <Mail className="text-[0.85rem]" />
                          {t("mailNote", { email: PROFILE.email })}
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
