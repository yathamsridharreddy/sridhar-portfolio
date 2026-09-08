import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaWandMagicSparkles, FaPaperPlane, FaXmark, FaRotateLeft } from "react-icons/fa6";
// Project answers are assembled from the same live records the Projects
// section renders, so the assistant can never drift from the visible data.
import { projects as liveProjects } from "../data/projects";
import { answerQuestion, welcomeText } from "../assistant/engine";
import { suggestedQuestions } from "../assistant/knowledge";

/**
 * "Ask My Portfolio" — a floating chat assistant for recruiters.
 *
 * There is no API key and no network call anywhere in this component: the
 * answer engine in ../assistant/engine.js replies deterministically from the
 * verified knowledge base, so it cannot hallucinate and nothing leaves the
 * visitor's browser.
 *
 * Accessibility: the launcher is a labelled toggle (aria-expanded), the panel
 * is a dialog with a focus trap and Escape-to-close, new replies are
 * announced via a role="log" live region, and all motion honours
 * prefers-reduced-motion.
 */

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const INLINE_TOKEN = /(\*\*[^*]+?\*\*|\*[^*]+?\*|\[[^\]]+\]\([^)]+\))/g;

/** Split engine text into paragraphs and bullet lists. */
function splitBlocks(text) {
  const blocks = [];
  let list = null;
  for (const line of (text || "").split("\n")) {
    if (/^-\s+/.test(line)) {
      if (!list) {
        list = [];
        blocks.push({ type: "ul", items: list });
      }
      list.push(line.replace(/^-\s+/, ""));
    } else {
      list = null;
      if (line.trim()) blocks.push({ type: "p", text: line });
    }
  }
  return blocks;
}

/** Inline rendering of **bold**, *italic* and [label](url) tokens. */
function inlineNodes(raw, onNavigate) {
  return raw
    .split(INLINE_TOKEN)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={i}>{escapeHtml(part.slice(2, -2))}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={i}>{escapeHtml(part.slice(1, -1))}</em>;
      }
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const href = m[2];
        if (/^https?:\/\//.test(href)) {
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer">
              {escapeHtml(m[1])}
            </a>
          );
        }
        // Internal "#section" links: close the panel so the section is seen.
        return (
          <a
            key={i}
            href={href}
            onClick={() => href.startsWith("#") && onNavigate?.()}
          >
            {escapeHtml(m[1])}
          </a>
        );
      }
      return <span key={i}>{escapeHtml(part)}</span>;
    });
}

function RichText({ text, onNavigate }) {
  const blocks = splitBlocks(text);
  return (
    <div className="aiRich">
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i}>
            {block.items.map((line, j) => (
              <li key={j}>{inlineNodes(line, onNavigate)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{inlineNodes(block.text, onNavigate)}</p>
        )
      )}
    </div>
  );
}

/** Monotonic id sequence that survives re-renders. */
function useSequence() {
  const ref = useRef(0);
  return () => ++ref.current;
}

export default function Assistant() {
  const reduced = useReducedMotion();
  const nextId = useSequence();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const panelRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus?.();
  }, []);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const scrollToBottom = useCallback(
    (smooth) => {
      const el = logRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: !smooth || reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  // Keep the newest message in view.
  useEffect(() => {
    if (open) scrollToBottom(true);
  }, [messages, busy, open, scrollToBottom]);

  // Focus the composer when the panel opens.
  useEffect(() => {
    if (open) later(() => inputRef.current?.focus?.(), 90);
  }, [open, later]);

  // Escape closes the panel — unless a larger overlay (project modal,
  // lightbox, command palette) is open on top; those own the Escape key.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !document.querySelector(".modalBg, .lightbox, .paletteBackdrop")) {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Trap Tab inside the panel while it is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    (raw) => {
      const text = (raw ?? input).trim();
      if (!text || busy) return;
      setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
      setInput("");
      setBusy(true);
      scrollToBottom(false);

      let reply;
      try {
        reply = answerQuestion(text, { liveProjects });
      } catch (err) {
        console.error("Assistant engine error:", err);
        reply = {
          text: "Something went wrong while I looked that up. Please try again — or rephrase the question.",
        };
      }
      // A short, human-feeling pause before the reply appears.
      later(() => {
        setMessages((m) => [...m, { id: nextId(), role: "ai", text: reply.text }]);
        setBusy(false);
        scrollToBottom(true);
      }, reduced ? 250 : 600 + Math.random() * 350);
    },
    [busy, input, nextId, later, reduced, scrollToBottom]
  );

  const clear = () => {
    setMessages([]);
    setBusy(false);
    later(() => inputRef.current?.focus?.(), 30);
  };

  const toggleOpen = () => (open ? close() : setOpen(true));

  const bubbleInitial = reduced ? undefined : { opacity: 0, y: 8 };
  const showWelcome = messages.length === 0;

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        ref={launcherRef}
        type="button"
        className="aiLauncher"
        aria-label={open ? "Close Ask My Portfolio assistant" : "Open Ask My Portfolio assistant"}
        aria-expanded={open}
        aria-controls="aiPanel"
        onClick={toggleOpen}
        initial={reduced ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.45 }}
        whileHover={reduced ? undefined : { scale: 1.06 }}
        whileTap={reduced ? undefined : { scale: 0.93 }}
        title="Ask my portfolio"
      >
        <FaWandMagicSparkles aria-hidden="true" />
        <span className="aiLauncherLabel">Ask my portfolio</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="aiPanel"
            ref={panelRef}
            className="aiPanel"
            role="dialog"
            aria-modal="false"
            aria-label="Ask My Portfolio assistant"
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="aiHead">
              <span className="aiAvatar" aria-hidden="true">
                <FaWandMagicSparkles />
              </span>
              <div className="aiHeadText">
                <p className="aiTitle">Ask My Portfolio</p>
                <p className="aiSub">Answers drawn only from this site</p>
              </div>
              <div className="aiHeadActions">
                <button
                  type="button"
                  className="aiIconBtn"
                  onClick={clear}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                  disabled={busy || messages.length === 0}
                >
                  <FaRotateLeft />
                </button>
                <button
                  type="button"
                  className="aiIconBtn"
                  onClick={close}
                  aria-label="Close assistant"
                  title="Close"
                >
                  <FaXmark />
                </button>
              </div>
            </div>

            {/* Message log */}
            <div
              className="aiLog"
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {showWelcome && (
                <motion.div
                  className="aiMsg aiMsgAi"
                  initial={bubbleInitial}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                >
                  <RichText text={welcomeText()} onNavigate={close} />
                </motion.div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  className={`aiMsg ${m.role === "user" ? "aiMsgUser" : "aiMsgAi"}`}
                  initial={bubbleInitial}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                >
                  {m.role === "ai" ? (
                    <RichText text={m.text} onNavigate={close} />
                  ) : (
                    <p>{m.text}</p>
                  )}
                </motion.div>
              ))}

              {busy && (
                <div className="aiMsg aiMsgAi" aria-label="Assistant is typing">
                  <span className="aiTyping" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}

              {/* Suggested questions (shown until the first question) */}
              {showWelcome && (
                <div className="aiSuggest">
                  <p className="aiSuggestLabel">Try asking</p>
                  <div className="aiChips">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="aiChip"
                        onClick={() => send(q)}
                        disabled={busy}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              className="aiComposer"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                id="aiInput"
                ref={inputRef}
                className="aiInput"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects, roles…"
                autoComplete="off"
                disabled={busy}
                aria-label="Ask a question about Sridhar"
              />
              <button
                type="submit"
                className="aiSend"
                aria-label="Send question"
                disabled={busy || !input.trim()}
              >
                <FaPaperPlane aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
