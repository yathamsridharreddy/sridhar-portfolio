import { useState, useEffect } from "react";
import { ref, runTransaction, onValue } from "firebase/database";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa6";
import { database } from "../firebase";
import { ease, dur } from "../motion";

const VIEW_COUNT_KEY = "portfolio_view_counted";

export default function ViewerCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const viewsRef = ref(database, "views");

    if (!sessionStorage.getItem(VIEW_COUNT_KEY)) {
      runTransaction(viewsRef, (current) => (current || 0) + 1)
        .then(() => sessionStorage.setItem(VIEW_COUNT_KEY, "true"))
        .catch(() => {});
    }

    const unsub = onValue(
      viewsRef,
      (snap) => {
        const v = snap.val();
        if (v !== null && v !== undefined) setCount(v);
      },
      () => {}
    );

    return () => unsub();
  }, []);

  // Stay hidden until we actually have a number worth showing.
  if (count === null) return null;

  return (
    <motion.div
      className="viewerCount"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: ease.out, delay: 1.6 }}
      title={`${count.toLocaleString()} total views`}
    >
      <FaEye />
      <span>{count.toLocaleString()}</span>
    </motion.div>
  );
}
