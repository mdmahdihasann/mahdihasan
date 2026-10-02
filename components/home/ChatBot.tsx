"use client";

import { ArrowUp, Bot, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";

import { profile } from "@/data/profile";
import { localReply, type ChatAction, type ChatTurn } from "@/lib/chat/localReply";
import { OPEN_CHAT } from "@/lib/events";
import { cn } from "@/lib/utils";

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
          className="fixed right-[clamp(16px,3vw,28px)] bottom-[calc(var(--fab-b)_+_70px)] z-110 flex h-[min(560px,calc(100svh_-_var(--fab-b)_-_110px))] w-[min(380px,calc(100vw_-_32px))] origin-bottom-right animate-chat-in flex-col overflow-hidden rounded-[22px] border border-sage/20 bg-[rgba(22,34,27,.94)] shadow-[0_30px_70px_-20px_rgba(0,0,0,.8),inset_0_1px_0_rgba(238,240,228,.06)] backdrop-blur-[20px] backdrop-saturate-150 max-[520px]:inset-x-3 max-[520px]:h-[min(560px,calc(100svh_-_var(--fab-b)_-_96px))] max-[520px]:w-auto motion-reduce:animate-none"
          role="dialog"
          aria-modal="false"
          aria-label={`Chat with ${profile.firstName}'s assistant`}
        >
          <header className="flex items-center gap-3 border-b border-line py-3.5 pr-3.5 pl-4">
            <span className="size-10 shrink-0 overflow-hidden rounded-full border border-khaki/35 bg-sage">
              <Image
                src="/portrait.jpg"
                alt=""
                width={40}
                height={40}
                className="size-full object-cover object-[50%_18%]"
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <strong className="font-display text-[15.5px] font-semibold tracking-[-.01em]">{profile.firstName}&apos;s assistant</strong>
              <span className="inline-flex items-center gap-[5px] text-[12px] text-leaf">
                <Sparkles size={12} aria-hidden /> Answers instantly, any time
              </span>
            </div>
            <button
              type="button"
              className="flex size-[34px] items-center justify-center rounded-[10px] text-fg-2 transition-colors duration-200 hover:bg-fg-1/7 hover:text-fg-1"
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <X size={18} aria-hidden />
            </button>
          </header>

          <div
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain p-4"
            ref={logRef} aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex max-w-[86%] flex-col gap-2",
                  m.role === "user" ? "self-end" : "self-start",
                )}
              >
                <p
                  className={cn(
                    "rounded-2xl px-[13px] py-2.5 text-[14px] leading-normal whitespace-pre-line wrap-anywhere [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-[3px]",
                    m.role === "user"
                      ? "rounded-br-[5px] bg-khaki text-ink"
                      : "rounded-bl-[5px] border border-line bg-fg-1/6 text-fg-1",
                  )}
                >
                  {withLinks(m.content)}
                </p>
                {m.actions && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.actions.map((a) => (
                      <a
                        key={a.href}
                        href={a.href}
                        onClick={() => onAction(a.href)}
                        className="rounded-full px-3 py-[7px] text-[12.5px] border border-khaki/40 bg-khaki/6 font-semibold text-khaki transition-colors duration-200 hover:bg-khaki hover:text-ink"
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
              <div
                className="flex gap-1 self-start rounded-2xl rounded-bl-[5px] border border-line bg-fg-1/6 px-3.5 py-[13px]"
                aria-label="Typing"
              >
                {[0, 0.15, 0.3].map((delay) => (
                  <i
                    key={delay}
                    className="size-1.5 animate-chat-dot rounded-full bg-sage motion-reduce:animate-none"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            )}
            {fresh && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full px-3 py-[7px] text-[12.5px] border border-line-strong font-medium text-fg-2 transition-[border-color,color,background-color] duration-200 hover:border-sage hover:bg-sage/8 hover:text-fg-1"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="flex gap-2 border-t border-line p-3" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Ask about ${profile.firstName}…`}
              aria-label="Your question"
              maxLength={1000}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-[14px] border border-line bg-fg-1/4 px-3.5 py-[11px] text-[14.5px] text-fg-1 transition-[border-color] duration-200 placeholder:text-fg-3 focus:border-khaki focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={busy || !draft.trim()}
              className="flex w-11 shrink-0 items-center justify-center rounded-[14px] bg-khaki text-ink transition-[opacity,background-color] duration-200 enabled:hover:bg-khaki-hi disabled:opacity-40"
            >
              <ArrowUp size={18} aria-hidden />
            </button>
          </form>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={cn(
          "fixed right-[clamp(16px,3vw,28px)] bottom-(--fab-b) z-106 flex size-14 items-center justify-center rounded-full text-ink max-[600px]:size-[52px]",
          "bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.45),transparent_45%),linear-gradient(135deg,var(--color-khaki),var(--color-leaf)_60%,var(--color-sage))]",
          "shadow-[0_14px_34px_-12px_rgba(217,210,163,.65),0_0_0_1px_rgba(22,34,27,.3)] transition-[translate,scale,box-shadow] duration-300 ease-smooth",
          "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(217,210,163,.75)] hover:brightness-106 active:scale-94",
          // A khaki halo pulses out from the closed launcher now and then.
          !open &&
            "after:pointer-events-none after:absolute after:-inset-px after:animate-[chatHalo_3.2s_var(--ease-smooth)_2.4s_infinite] after:rounded-[inherit] after:border-2 after:border-khaki after:opacity-0 motion-reduce:after:animate-none",
        )}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close chat" : `Ask about ${profile.firstName}`}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} aria-hidden /> : <Bot
            size={26}
            strokeWidth={1.9}
            className="animate-bot-look motion-reduce:animate-none"
            aria-hidden
          />}
      </button>
    </>
  );
};

export default ChatBot;
