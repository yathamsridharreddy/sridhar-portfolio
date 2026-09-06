import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa6";
import { ease, dur } from "../motion";

const VIEW_COUNT_KEY = "portfolio_view_counted";

/**
 * The view counter is the only thing on the page that needs Firebase, and it
 * renders a single number in the corner. Pulling the SDK into the initial
 * bundle would make every visitor download it before the hero can paint, so we
 * import it dynamically once the browser is idle. Firebase lands in its own
 * chunk and the counter simply appears a moment later.
 */
export default function ViewerCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let unsub = null;

    const load = async () => {
      try {
        const [{ ref, runTransaction, onValue }, { database }] =
          await Promise.all([
            import("firebase/database"),
            import("../firebase"),
          ]);
        if (cancelled) return;

        const viewsRef = ref(database, "views");

        if (!sessionStorage.getItem(VIEW_COUNT_KEY)) {
          runTransaction(viewsRef, (current) => (current || 0) + 1)
            .then(() => sessionStorage.setItem(VIEW_COUNT_KEY, "true"))
            .catch(() => {});
        }

        unsub = onValue(
          viewsRef,
          (snap) => {
            const v = snap.val();
            if (!cancelled && v !== null && v !== undefined) setCount(v);
          },
          () => {}
        );
      } catch {
        // Offline, blocked by an extension, or rules denied it. Stay hidden.
      }
    };

    // Wait for a quiet moment so the counter never competes with the hero.
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(load, { timeout: 3000 })
        : window.setTimeout(load, 1200);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
      if (unsub) unsub();
    };
  }, []);

  // Stay hidden until we actually have a number worth showing.
  if (count === null) return null;

  return (
    <motion.div
      className="viewerCount"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: ease.out }}
      title={`${count.toLocaleString()} total views`}
    >
      <FaEye />
      <span>{count.toLocaleString()}</span>
    </motion.div>
  );
}
