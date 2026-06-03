/* CHAT, floating assistant panel */

const SEED_REPLY = {
  default:
    "Hi, I'm a portfolio assistant trained on Kavishwa's work. Try one of the prompts below, or ask anything about research, projects, CV, publications, or collaboration.",
  research:
    "Kavishwa's PhD at the University of Oulu focuses on secure, privacy-centric AI for real-time pediatric brain health monitoring, combining federated learning, self-adaptive systems, and regulatory compliance in mHealth platforms.",
  production:
    "Production engineering experience comes from 3+ years at Informatics International (2019–2022) shipping national-scale systems for Sri Lanka: the IOM e-passport platform, government language integration, and the SLRCMS readmission case management system.",
  collab:
    "Open to collaboration on: federated learning for clinical sites, self-adaptive AI loops (monitor → decide → adapt → verify), pediatric ethics & long-horizon data, and bridging MDR / FDA SaMD with engineering practice.",
  healthcare:
    "Kavishwa's healthcare AI work spans EEG + LLM cognitive monitoring (M.Sc. thesis, TKTP 2025 paper), an AI-powered doctor–patient management web app (B.Sc.), and the doctoral programme on pediatric brain health, all centered on privacy-by-construction.",
  pubs:
    "Publications: 1 conference paper (TKTP 2025, Helsinki) on cognitive overload in software engineers; the M.Sc. thesis (Oulu, 2024) on AI-driven mental workload monitoring; the B.Sc. thesis (NSBM, 2020) on doctor–patient management software validation.",
};

const matchReply = (q) => {
  const s = q.toLowerCase();
  if (/phd|research|doctor/.test(s))           return SEED_REPLY.research;
  if (/production|engineer|industry|shipped/.test(s)) return SEED_REPLY.production;
  if (/collab|topic|together/.test(s))         return SEED_REPLY.collab;
  if (/healthcare|medical|brain/.test(s))      return SEED_REPLY.healthcare;
  if (/publication|paper|talk/.test(s))        return SEED_REPLY.pubs;
  return "Good question, that's in scope. The short version: " +
    "Kavishwa builds privacy-preserving AI for pediatric brain health, with 3+ years of national-scale engineering behind it. " +
    "For a real answer, hit Contact and we'll route to him directly.";
};

const Chat = () => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [msgs, setMsgs] = React.useState([
    { role: "assistant", text: SEED_REPLY.default },
  ]);
  const streamRef = React.useRef(null);

  React.useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [msgs, open]);

  // Listen for #chat hash to open
  React.useEffect(() => {
    const fn = () => { if (location.hash === "#chat") setOpen(true); };
    window.addEventListener("hashchange", fn);
    fn();
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: t }]);
    setTimeout(() => {
      setMsgs(m => [...m, { role: "assistant", text: matchReply(t) }]);
    }, 600);
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{display: open ? "none" : "grid"}}
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
              <div className="status">● Online · trained on Kavishwa</div>
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

        <div className="chat-prompts">
          {CHAT_PROMPTS.map((p) => (
            <button key={p} className="chat-prompt" onClick={() => send(p)}>{p}</button>
          ))}
        </div>

        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about research, projects, CV…"
            aria-label="Message"
          />
          <button type="submit" aria-label="Send"><Icon.send /></button>
        </form>
      </div>
    </>
  );
};

Object.assign(window, { Chat });
