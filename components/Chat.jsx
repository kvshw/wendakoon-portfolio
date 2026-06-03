"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT_PROMPTS, CV_URL } from "@/lib/data";
import { Icon } from "@/components/primitives/Icons";

const STORAGE_KEY = "kw-portfolio-chat-v1";

const SEED_REPLY = {
  default:
    "Hi, I'm Kavishwa's portfolio assistant. He's a FAST-funded PhD researcher at Oulu who also spent three years shipping national-scale government systems in Sri Lanka. Ask about Papers I–IV, the MAPE-K constraint layer, SLRCMS/e-passport, or how to collaborate.",
  research:
    "The PhD asks one question: how do you make adaptive AI in clinical decision support trustworthy enough to deploy, and how do you prove it? Two papers are already accepted. Paper I (SLR, 20 studies): the field knows adaptive clinical AI drifts, but rigorous ways to constrain, audit, and roll back that drift are still mostly missing. Paper II (DSR architecture): a Constraint Layer over the MAPE-K loop with safety bounds, validation gates, evidence anchoring, and audit/rollback, evaluated with seven clinical stakeholders in nurse-led triage. Paper III (2026): simulating concept drift and adversarial inputs against an unconstrained baseline. Paper IV (planned): 16–24 clinicians on trust, reliance, and decision-making (target JAMIA/JBI). Supervised by Nirnaya Tripathi · FAST Finnish Software Engineering Doctoral Network.",
  production:
    "Before the PhD: three years at Informatics International (2019–2022) on national-scale systems in Sri Lanka. SLRCMS, a readmission case management platform used country-wide, with Ministry of Health recognition in 2022. IOM Sri Lanka e-passport: secure digital passport infrastructure (React, TypeScript, security-first). Plus multilingual government platform integration. That's why the research isn't theoretical: he's shipped systems that had to survive real regulatory and operational pressure.",
  collab:
    "Strongest fit: clinical AI × software engineering. Concrete openings right now: co-authors on Paper III (runnable MAPE-K prototype + drift simulation, target EMSE/JSS), clinical sites for Paper IV (mixed-methods trust study, 16–24 participants), or industry partners who need MDR/GDPR turned into architecture teams can implement. He brings accepted governance papers, a stress-testable prototype, and the rare combo of doctoral framing plus national-scale shipping experience. Paper IV needs real clinicians early. If that's you or your institution, reach out via Contact.",
  healthcare:
    "Clinical AI safety here is architectural, not rhetorical. Paper I's core finding: most governance frameworks assume the model is fixed after deployment. Clinical AI keeps adapting. Paper II responds with four mechanisms sitting over the adaptation loop so every change is bounded, traceable, and reversible. Instantiation: nurse-led primary-care triage. Earlier thread: B.Sc. validated doctor–patient management software; M.Sc. + TKTP 2025 used EEG + LLMs to detect cognitive overload in software engineers, same pattern of sense → decide → intervene, with safety constraints.",
  governance:
    "Runtime governance is the through-line. The MAPE-K loop (Monitor–Analyze–Plan–Execute over shared Knowledge) lets clinical AI adapt after deployment. The Constraint Layer sits on top with four mechanisms: hard safety bounds, validation gates before each update, evidence anchoring to clinical guidelines, and audit/rollback when behavior diverges from what was approved. Paper III is the stress test: inject drift and adversarial feedback, compare constrained vs. unconstrained baselines. Kavishwa's line on this: \"Adaptation without governance is just drift by another name.\"",
  pubs:
    "On the site now: accepted PhD work includes Paper II (2026) safety-constrained MAPE-K architecture, DSR, n=7 stakeholders; Paper I (2025) systematic review across 20 self-adaptive CDSS studies (PRISMA/Kitchenham). Also: TKTP 2025 Helsinki on EEG + LLMs for cognitive overload in software engineers; M.Sc. thesis (Oulu 2024) on mental workload monitoring; B.Sc. thesis (NSBM 2020) on doctor–patient management validation. Scroll to #publications for details and PDFs.",
  cv:
    `Arc: B.Sc. Software Engineering (NSBM, 2017–2020) → Software Engineer at Informatics International (2019–2022, national-scale e-gov) → M.Sc. Software Engineering (Oulu, 2022–2024, EEG/LLM thesis) → Doctoral Researcher (Oulu, 2024–now, FAST-funded). Stack spans Python, TypeScript, React, Node, Flutter, PyTorch, MAPE-K/self-adaptive AI, and DSR. Two awards: SLRCMS national recognition (2022) and Finnish Software Engineering Doctoral Pilot (2024). Full timeline at #cv. PDF at ${CV_URL}.`,
  contact:
    "Best route: the Contact section on this site. For collaborations, mention whether you're a clinical site, co-author, industry partner, or student. That helps route faster. Paper IV clinician recruitment and Paper III simulation co-authorship are live openings for 2026.",
  about:
    "Kavishwa Wendakoon, doctoral researcher and software engineer based in Oulu, Finland (65°N). Researcher who builds and ships: national e-gov systems in Sri Lanka, then a PhD on governed adaptive clinical AI. The research journey reframed every few years: monitoring → intervention (2022), unconstrained adaptation → constrained adaptation (2023), accuracy → trust & accountability (2024), theory → runnable governance (2025), component safety → systemic clinical governance (2026+). Pick a perspective in the For You section if you're a recruiter, collaborator, industry partner, or student.",
};

const FALLBACKS = [
  "Worth knowing: he didn't start in academia. Three years shipping SLRCMS and the IOM e-passport before the PhD. That production background is why Paper II is about runnable governance, not just diagrams. Ask about Papers I–IV, shipped systems, or collaboration.",
  "One concrete detail most people miss: Paper I reviewed 20 studies and found researchers acknowledge drift, but engineering methods to constrain it in safety-critical settings are largely absent. That's the gap Paper II–IV are built to close.",
  "If you're comparing candidates: he's published on adaptive clinical AI governance *and* has national-scale deployment on his CV. Try asking about the MAPE-K constraint layer, Paper III simulation, or what he shipped in Sri Lanka.",
];

const loadStoredMessages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { msgs } = JSON.parse(raw);
    if (!Array.isArray(msgs) || msgs.length === 0) return null;
    return msgs.filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string");
  } catch {
    return null;
  }
};

const saveMessages = (msgs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ msgs, updatedAt: Date.now() }));
  } catch {
    /* quota / private mode */
  }
};

const clearStoredMessages = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

const matchReply = (q) => {
  const s = q.toLowerCase();

  if (/paper\s*(iii|3|iv|4)|prototype|simulation|drift|mape|constraint|govern/.test(s)) {
    return SEED_REPLY.governance;
  }
  if (/publication|paper|talk|accepted|pdf|journal|conference/.test(s)) return SEED_REPLY.pubs;
  if (/contact|email|reach|hire|message him|get in touch/.test(s)) return SEED_REPLY.contact;
  if (/phd|doctoral|research|fast|paper i|paper ii|university of oulu/.test(s)) return SEED_REPLY.research;
  if (/production|engineer|industry|shipped|slrcms|passport|e-passport|informatics|sri lanka|national/.test(s)) {
    return SEED_REPLY.production;
  }
  if (/collab|co-author|together|partner|paper iv|clinical site|2026/.test(s)) return SEED_REPLY.collab;
  if (/healthcare|medical|clinical|safety|trustworthy|cdss|triage|clinician/.test(s)) return SEED_REPLY.healthcare;
  if (/\bcv\b|resume|curriculum|timeline|skill|award|experience/.test(s)) return SEED_REPLY.cv;
  if (/who is|who's kavishwa|journey|philosophy|tell me about him/.test(s)) return SEED_REPLY.about;

  const idx = Math.abs([...q].reduce((n, c) => n + c.charCodeAt(0), 0)) % FALLBACKS.length;
  return `${FALLBACKS[idx]} For a direct answer from Kavishwa, use Contact.`;
};

const INITIAL_MSGS = [{ role: "assistant", text: SEED_REPLY.default }];

export const Chat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(INITIAL_MSGS);
  const [ready, setReady] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    const saved = loadStoredMessages();
    if (saved?.length) setMsgs(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveMessages(msgs);
  }, [msgs, ready]);

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [msgs, open]);

  useEffect(() => {
    const fn = () => {
      if (window.location.hash === "#chat") setOpen(true);
    };
    window.addEventListener("hashchange", fn);
    fn();
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  const hasUserMsgs = msgs.some((m) => m.role === "user");

  const startNewConversation = useCallback(() => {
    clearStoredMessages();
    setMsgs(INITIAL_MSGS);
    setInput("");
  }, []);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", text: matchReply(t) }]);
    }, 600);
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{ display: open ? "none" : "grid" }}
      >
        <Icon.chat />
        <span className="lbl">Chat with Me</span>
      </button>

      <div id="chat" className={`chat-panel ${open ? "open" : ""}`} role="dialog" aria-label="Portfolio assistant">
        <div className="chat-head">
          <div className="who">
            <div className="avatar">KW</div>
            <div>
              <div className="name">Portfolio Assistant</div>
              <div className="status">
                ● Online · {hasUserMsgs ? "conversation saved on this device" : "trained on Kavishwa"}
              </div>
            </div>
          </div>
          <button className="close" onClick={() => setOpen(false)} aria-label="Close">
            <Icon.close />
          </button>
        </div>

        <div className="chat-stream" ref={streamRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
          ))}
        </div>

        {!hasUserMsgs && (
          <div className="chat-prompts">
            {CHAT_PROMPTS.map((p) => (
              <button key={p} className="chat-prompt" onClick={() => send(p)}>{p}</button>
            ))}
          </div>
        )}

        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about research, papers, shipped systems…"
            aria-label="Message"
          />
          <button type="submit" aria-label="Send"><Icon.send /></button>
        </form>

        {hasUserMsgs && (
          <div className="chat-foot">
            <button type="button" className="chat-clear" onClick={startNewConversation}>
              Start new conversation
            </button>
          </div>
        )}
      </div>
    </>
  );
};
