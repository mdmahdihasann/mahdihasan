"use client";

import { ArrowUp, MessageCircle, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";

import { profile } from "@/data/profile";
import { localReply, type ChatAction, type ChatTurn } from "@/lib/chat/localReply";
import { OPEN_CHAT } from "@/lib/events";

type Message = ChatTurn & { actions?: ChatAction[] };

export const CHAT_API = "/api/chat";

export const SUGGESTIONS = [
  "What are his skills?",
  "What services does he offer?",
  "Tell me about his experience",
  "I want to hire him",
];

const GREETING: Message = {
  role: "assistant",
  content: `Hi! 👋 I'm ${profile.firstName}'s assistant. Ask me anything about his skills, services or experience — in English or Bangla.`,
};

/** Turns email addresses in a reply into mailto links. */
const EMAIL_RE = /([\w.+-]+@[\w-]+\.[\w.]+)/g;
const withLinks = (text: string) =>
  text.split(EMAIL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );

async function ask(history: Message[]): Promise<Message> {
  const question = history.at(-1)?.content ?? "";
  try {
    const res = await fetch(CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.map(({ role, content }) => ({ role, content })),
      }),
    });
    const data = (await res.json()) as { text?: string; actions?: ChatAction[] };
    if (data.text) return { role: "assistant", content: data.text, actions: data.actions };
  } catch {
    // Offline or no server: answer from the same data in the browser.
  }
  const local = localReply(question);
  return { role: "assistant", content: local.text, actions: local.actions };
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // The command palette opens the assistant through a window event.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT, onOpen);
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const history: Message[] = [...messages, { role: "user", content: question }];
    setMessages(history);
    setDraft("");
    setBusy(true);
    const reply = await ask(history.filter((m) => m !== GREETING));
    setMessages((prev) => [...prev, reply]);
    setBusy(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(draft);
  };

  const onAction = (href: string) => {
    if (href.startsWith("#")) setOpen(false);
  };

  const fresh = messages.length === 1;

  return (
    <>
      {open && (
        <div
          id={panelId}
          className="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label={`Chat with ${profile.firstName}'s assistant`}
        >
          <header className="chat-head">
            <span className="chat-avatar">
              <Image src="/portrait.jpg" alt="" width={40} height={40} />
            </span>
            <div className="chat-who">
              <strong>{profile.firstName}&apos;s assistant</strong>
              <span className="chat-status">
                <Sparkles size={12} aria-hidden /> Answers instantly, any time
              </span>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <X size={18} aria-hidden />
            </button>
          </header>

          <div className="chat-log" ref={logRef} aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "from-user" : "from-bot"}`}>
                <p>{withLinks(m.content)}</p>
                {m.actions && (
                  <div className="chat-actions">
                    {m.actions.map((a) => (
                      <a
                        key={a.href}
                        href={a.href}
                        onClick={() => onAction(a.href)}
                        {...(a.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {a.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="chat-msg from-bot chat-typing" aria-label="Typing">
                <i />
                <i />
                <i />
              </div>
            )}
            {fresh && (
              <div className="chat-suggest">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => void send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Ask about ${profile.firstName}…`}
              aria-label="Your question"
              maxLength={1000}
              autoComplete="off"
            />
            <button type="submit" aria-label="Send" disabled={busy || !draft.trim()}>
              <ArrowUp size={18} aria-hidden />
            </button>
          </form>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`chat-launcher${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close chat" : `Ask about ${profile.firstName}`}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} aria-hidden /> : <MessageCircle size={22} aria-hidden />}
      </button>
    </>
  );
};

export default ChatBot;
