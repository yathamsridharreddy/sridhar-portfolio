import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaTriangleExclamation, FaCircleCheck, FaRotateLeft } from "react-icons/fa6";
import { ease } from "../motion";

/**
 * Chaos drill — the site's easter egg.
 *
 * Triggered by the Konami code, by `chaos` in the terminal, or from the
 * command palette. It plays out a production incident and an automatic
 * rollback: detection, alert, rollback, drain, health checks, resolution.
 *
 * Same philosophy as the delivery pipeline. Rather than decorating the page,
 * it performs the discipline — and it ends on an MTTR figure, which is one of
 * the numbers cloud and DevOps work is actually judged on.
 */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const STEPS = [
  { at: 0, level: "err", text: "ALERT  p99 latency 4200ms · error rate 12.4% · region ap-south-1" },
  { at: 700, level: "warn", text: "PagerDuty triggered · severity SEV-2 · on-call paged" },
  { at: 1500, level: "info", text: "Correlating with deploy 7f3a91c pushed 94s ago" },
  { at: 2300, level: "warn", text: "Automatic rollback initiated · target revision 6fc02ff" },
  { at: 3100, level: "info", text: "Draining connections from 4 unhealthy pods" },
  { at: 3900, level: "info", text: "kubectl rollout undo deployment/api · 4/4 replicas ready" },
  { at: 4700, level: "info", text: "Health checks passing · /healthz 200 · /readyz 200" },
  { at: 5500, level: "ok", text: "Error rate 0.02% · p99 back to 180ms" },
  { at: 6300, level: "ok", text: "RESOLVED  MTTR 47s · zero data loss · no manual intervention" },
];

const TOTAL = 7200;

export default function ChaosMode() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const timers = useRef([]);
  const restoreRef = useRef(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const close = useCallback(() => {
    clearTimers();
    setOpen(false);
    setShown(0);
    restoreRef.current?.focus?.();
  }, []);

  const start = useCallback(() => {
    setOpen((already) => {
      if (already) return true;
      restoreRef.current = document.activeElement;
      return true;
    });
  }, []);

  // Konami code. Tracks position rather than keeping a rolling buffer.
  useEffect(() => {
    let pos = 0;
    const onKey = (e) => {
      const t = e.target;
      // Never swallow keys meant for the terminal input or the palette.
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const want = KONAMI[pos];
      const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (got === want) {
        pos += 1;
        if (pos === KONAMI.length) {
          pos = 0;
          start();
        }
      } else {
        pos = got === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  useEffect(() => {
    const onRun = () => start();
    window.addEventListener("portfolio:chaos", onRun);
    return () => window.removeEventListener("portfolio:chaos", onRun);
  }, [start]);

  // Schedule the incident once the overlay opens.
  useEffect(() => {
    if (!open) return;

    if (reduced) {
      setShown(STEPS.length);
      return;
    }

    setShown(0);
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), STEPS[i].at + 250));
    });
    timers.current.push(setTimeout(() => close(), TOTAL + 2600));
    return clearTimers;
  }, [open, reduced, close]);

  // Lock the page behind the overlay and wire Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const done = shown >= STEPS.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="chaos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Chaos drill"
        >
          <motion.div
            className={`chaosPanel${done ? " is-resolved" : ""}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.32, ease: ease.out }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chaosHead">
              <span className="chaosBadge" aria-hidden="true">
                {done ? <FaCircleCheck /> : <FaTriangleExclamation />}
              </span>
              <div>
                <p className="chaosTitle">
                  {done ? "Incident resolved" : "Incident in progress"}
                </p>
                <p className="chaosSub">
                  Chaos drill · this is a simulation, nothing is actually on fire
                </p>
              </div>
              <button className="chaosClose" onClick={close} aria-label="Close chaos drill">
                esc
              </button>
            </div>

            <div className="chaosLog" role="log" aria-live="polite">
              {STEPS.slice(0, shown).map((s, i) => (
                <motion.p
                  key={s.text}
                  className={`chaosLine l-${s.level}`}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, ease: ease.out }}
                >
                  <span className="chaosTs">
                    {String(Math.floor(STEPS[i].at / 1000)).padStart(2, "0")}s
                  </span>
                  {s.text}
                </motion.p>
              ))}
            </div>

            <div className="chaosBarTrack" aria-hidden="true">
              <motion.div
                className="chaosBar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: done ? 1 : shown / STEPS.length }}
                transition={{ duration: 0.5, ease: ease.out }}
              />
            </div>

            <p className="chaosFoot">
              <FaRotateLeft aria-hidden="true" />
              Rollback is automated. The pipeline above is the same idea, minus
              the drama.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
