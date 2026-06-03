/* DATA, Kavishwa Wendakoon portfolio
   All content for sections lives here for easy edits. */

const NAV_LINKS = [
  { id: "about",        label: "About" },
  { id: "research",     label: "Research" },
  { id: "projects",     label: "Projects" },
  { id: "cv",           label: "CV" },
  { id: "publications", label: "Publications" },
  { id: "blog",         label: "Blog" },
  { id: "contact",      label: "Contact" },
];

const HERO_STATS = [
  { val: "PhD", lbl: "University of Oulu",  acc: true  },
  { val: "3+",  lbl: "Years Industry",       acc: false },
  { val: "10+", lbl: "Projects Shipped",     acc: false },
  { val: "3",   lbl: "Publications",         acc: false },
];

const ORIENT_CARDS = [
  { idx: "01", title: "Research",     body: "Domains, methods & doctoral focus.",            to: "research"     },
  { idx: "02", title: "Projects",     body: "Selected case files & shipped work.",           to: "projects"     },
  { idx: "03", title: "CV",           body: "Experience, skills & timeline.",                to: "cv"           },
  { idx: "04", title: "Publications", body: "Papers, talks & prototypes.",                   to: "publications" },
  { idx: "05", title: "Contact",      body: "Email, form & collaboration.",                  to: "contact"      },
  { idx: "06", title: "Chat",         body: "Ask the portfolio assistant about my work.",    to: "chat"         },
];

const PERSPECTIVES = [
  {
    id: "recruiters",
    name: "Recruiters",
    num: "01",
    title: "Doctoral Researcher with Industry Engineering Background",
    quote: "Looking for roles bridging research and real-world healthcare AI systems.",
    stats: [
      { v: "3+",  l: "Years Experience" },
      { v: "3",   l: "Publications" },
      { v: "10+", l: "Projects" },
    ],
    highlights: [
      "Doctoral researcher at University of Oulu with 3+ years industry experience.",
      "Focus on secure, privacy-centric AI for pediatric brain health.",
      "Built national-scale systems: e-passport, government language integration, case management.",
      "Strong full-stack skills: React, TypeScript, Node.js, Python, Flutter.",
    ],
    cta: { label: "Download CV", primary: true },
    next: "collaborators",
  },
  {
    id: "collaborators",
    name: "Research Collaborators",
    num: "02",
    title: "Open to Co-authors in Trustworthy & Medical AI",
    quote: "I bring engineering rigor and a clear thesis: AI for pediatric brain health must be private by construction.",
    stats: [
      { v: "4", l: "Active Domains" },
      { v: "1", l: "Funded Pilot" },
      { v: "2", l: "Open Datasets" },
    ],
    highlights: [
      "Federated learning architectures for cross-hospital training without centralization.",
      "Regulatory-aware self-adaptive AI loops (monitor → decide → adapt → verify).",
      "EEG + LLM cognitive load monitoring with published M.Sc. + conference work.",
      "Active in the Finnish Software Engineering Doctoral Pilot Program.",
    ],
    cta: { label: "Propose a Collaboration", primary: true },
    next: "industry",
  },
  {
    id: "industry",
    name: "Industry Partners",
    num: "03",
    title: "Ship Trustworthy AI Into Production",
    quote: "I translate research-grade AI into systems that survive regulatory, scale, and clinical reality.",
    stats: [
      { v: "4", l: "National Systems" },
      { v: "10+", l: "Projects Shipped" },
      { v: "2", l: "Awards" },
    ],
    highlights: [
      "National e-passport + readmission case management, shipped, audited, at scale.",
      "Full-stack delivery on React / TypeScript / Node / Python / Flutter.",
      "On-device ML for mobile health where privacy is non-negotiable.",
      "Translates compliance language (GDPR, MDR) into architecture decisions.",
    ],
    cta: { label: "Start an Engagement", primary: true },
    next: "students",
  },
  {
    id: "students",
    name: "Students",
    num: "04",
    title: "Mentorship in AI, Engineering & Research",
    quote: "Pick the problem first. Methods follow. Privacy and trust are not afterthoughts.",
    stats: [
      { v: "M.Sc.", l: "Mentored Theses" },
      { v: "5", l: "Workshops" },
      { v: "Open", l: "Reviews" },
    ],
    highlights: [
      "Happy to review thesis drafts in healthcare AI, mHealth, or trustworthy ML.",
      "Office-hour conversations on bridging research → production engineering.",
      "Reading lists curated around federated learning + self-adaptive systems.",
      "Practical advice on building portfolios that survive academic + industry filters.",
    ],
    cta: { label: "Ask a Question", primary: false },
    next: "recruiters",
  },
];

const RESEARCH_AREAS = [
  {
    idx: "01",
    badge: "Primary Focus",
    title: "Pediatric Brain Health AI",
    body: "My central research question: how do we build AI that can monitor and protect children's brain health in real time, without compromising their privacy? I'm developing secure, privacy-centric AI for real-time personalized pediatric brain health management. Federated learning, self-adaptive systems, and regulatory compliance integrated into mobile health platforms clinicians and families can trust.",
    tags: ["Pediatric Health", "Privacy-Preserving AI", "Federated Learning", "Regulatory Compliance"],
    papers: "2",
    prototypes: "1",
    cta: "Read more",
  },
  {
    idx: "02",
    title: "Trustworthy & Generative AI",
    body: "Building AI systems that are transparent, explainable, and meet regulatory compliance for high-stakes domains.",
    tags: ["Generative AI", "Explainability", "AI Agent-based Development"],
    papers: "1",
    prototypes: "1",
  },
  {
    idx: "03",
    title: "mHealth & Mobile AI",
    body: "Advancing mobile health solutions that bring AI-driven monitoring closer to patients and clinicians through privacy-preserving architectures.",
    tags: ["Mobile Health", "Flutter", "On-Device ML", "Patient Management"],
    papers: "1",
    prototypes: "3",
  },
  {
    idx: "04",
    title: "Full-Stack & Systems Engineering",
    body: "3+ years building national-scale production systems, from e-passport infrastructure to government language integration.",
    tags: ["E-Governance", "System Architecture", "Full-Stack Development"],
    papers: "0",
    prototypes: "5",
  },
];

const PROJECTS = [
  {
    idx: "01",
    slug: "CASE/SLRCMS",
    status: "Shipped",
    year: "2020",
    type: "Company",
    title: "SLRCMS: Readmission Case Management",
    body: "Sri Lanka needed a modern, scalable system for managing readmission cases across the country, replacing fragmented manual processes.",
    tags: ["E-Governance", "Full-Stack", "National-Scale"],
    evidence: ["System", "Award"],
  },
  {
    idx: "02",
    slug: "CASE/E-PASSPORT",
    status: "Shipped",
    year: "2021",
    type: "Company",
    title: "E-Passport System, IOM Sri Lanka",
    body: "The International Organization for Migration needed a secure digital passport system for Sri Lanka with a modern web interface.",
    tags: ["E-Governance", "Security", "React", "TypeScript"],
    evidence: ["Architecture", "Prototype"],
  },
  {
    idx: "03",
    slug: "CASE/MEDICAL-WEB-APP",
    status: "Completed",
    year: "2020",
    type: "Personal",
    title: "Medical Web App for Doctor–Patient Management",
    body: "Healthcare professionals needed a secure, AI-powered tool to manage patient data and automate prescription generation.",
    tags: ["Healthcare", "AI", "React", "Python"],
    evidence: ["B.Sc. Thesis", "Prototype"],
  },
];

const JOURNEY = [
  {
    year: "2022", num: "01", tag: "Foundation",
    title: "Monitoring", arrow: "→", title2: "Intervention",
    quote: "Passive observation is insufficient, systems must act when safety thresholds are crossed.",
  },
  {
    year: "2023", num: "02", tag: "Reframing",
    title: "Adaptation", arrow: "→", title2: "Constrained Adaptation",
    quote: "Unconstrained learning creates risk. Adaptation must occur within policy boundaries.",
  },
  {
    year: "2024", num: "03", tag: "Reframing",
    title: "Model Performance", arrow: "→", title2: "Trust & Accountability",
    quote: "Accuracy alone doesn't build confidence. Transparency and auditability matter more.",
  },
  {
    year: "2025", num: "04", tag: "Integration",
    title: "Theory", arrow: "→", title2: "Runnable Governance",
    quote: "Research impact requires implementation. Ideas must become deployable artifacts.",
  },
  {
    year: "2026+", num: "05", tag: "Current",
    title: "Individual Safety", arrow: "→", title2: "Systemic Clinical Governance",
    quote: "Component-level safety doesn't guarantee system safety. Governance must be architectural.",
  },
];

const MILESTONES = [
  { yr: "22", lbl: "Foundation" },
  { yr: "23", lbl: "Reframing" },
  { yr: "25", lbl: "Integration" },
  { yr: "26", lbl: "Current" },
];

const FOCUS_AREAS = [
  {
    id: "investigating",
    num: "01",
    title: "What I'm investigating",
    preview: "Secure, privacy-centric AI for real-time pediatric brain health.",
    body: "How to build AI systems that can monitor and manage pediatric brain health in real time while preserving patient privacy at every layer. The core tension: personalization requires data, but the most sensitive patients, children, deserve the strongest protections.",
    deep: "I'm exploring how federated learning architectures can enable collaborative model training across hospitals without centralizing sensitive patient data. The challenge is maintaining model accuracy and personalization while meeting regulatory compliance standards across different healthcare jurisdictions.",
    tags: ["Pediatric Brain Health", "Privacy-Preserving AI", "Federated Learning", "Regulatory Compliance"],
    related: "Doctoral Research Program",
    quote: "I care about what happens when AI meets the most vulnerable patients, children whose data demands the strongest protections.",
  },
  {
    id: "building",
    num: "02",
    title: "What I'm building",
    preview: "mHealth integrating self-adaptive AI with privacy-preserving techniques.",
    body: "Working prototypes that operationalize the research: mobile-first clinical tooling that runs local inference, federates updates, and keeps regulators happy.",
    deep: "The current build is a Flutter front-end + on-device inference layer + a federated update channel scoped to participating hospitals. The system logs every policy decision so the audit trail is a first-class artifact, not a retrofit.",
    tags: ["Flutter", "On-Device ML", "Self-Adaptive AI", "Audit-First Architecture"],
    related: "Doctoral Prototype 02",
    quote: "An idea that can't run on a clinician's device is not yet research, it's a slide deck.",
  },
  {
    id: "questioning",
    num: "03",
    title: "What I'm questioning",
    preview: "Whether current AI trustworthiness frameworks are enough for pediatric care.",
    body: "Existing frameworks were built for adult, anonymized, mostly Western datasets. They under-specify what 'trustworthy' means when the subject is a developing child whose data outlives the system that collected it.",
    deep: "I'm mapping the gaps between EU MDR, FDA SaMD guidance, and the lived practice of pediatric clinicians. Where the frameworks under-specify, governance has to be designed in.",
    tags: ["Trustworthiness", "Pediatric Ethics", "Regulatory Gaps", "Long-Horizon Data"],
    related: "Position Paper (Draft)",
    quote: "If 'trustworthy AI' doesn't survive a 15-year horizon of a child's data, it isn't trustworthy.",
  },
  {
    id: "open",
    num: "04",
    title: "What I'm open to",
    preview: "Collaboration on medical AI, mHealth, and privacy-preserving systems.",
    body: "Co-authors, clinical sites, students, and engineering teams who want to ship trustworthy systems instead of write about them.",
    deep: "I bring both sides of the bench: the doctoral framing and the engineer who has put national-scale systems into production. If your work needs that combination, I want to hear about it.",
    tags: ["Co-Authorship", "Clinical Pilots", "Student Mentorship", "Industry Partnership"],
    related: "Open Calls 2025–2026",
    quote: "The systems I want to build need more hands than mine.",
  },
];

const CV_STATS = [
  { v: "3+",  l: "Years in Industry" },
  { v: "10+", l: "Projects Shipped" },
  { v: "4",   l: "National-Scale Systems" },
  { v: "2",   l: "Awards" },
];

const CV_TIMELINE = [
  {
    when: "2024 – Now",
    type: "Research",
    title: "Doctoral Researcher",
    org: "University of Oulu, Finland",
    desc: "Selected for the Finnish Software Engineering Doctoral Pilot Program. Research on secure, privacy-centric AI for real-time personalized pediatric brain health management and advancing mHealth technologies.",
    bullets: [
      "Research on Generative AI, Trustworthy AI, and AI Agent-based Software Development.",
      "Focus on Software Security, Regulatory Compliance, and Pediatric Brain Health.",
      "Developing medical AI solutions for mobile health (mHealth).",
      "Integrating self-adaptive AI, federated learning, and privacy-preserving techniques.",
    ],
    stack: ["Python", "Machine Learning", "Federated Learning", "Kubernetes", "Flutter"],
  },
  {
    when: "2022 – 2024",
    type: "Education",
    title: "M.Sc. Software Engineering",
    org: "University of Oulu, Finland",
    desc: "Master's thesis on AI-driven mental workload monitoring and well-being management in workplace settings, combining EEG signals with LLM-driven recommendations.",
    stack: ["EEG", "LLMs", "Python", "Signal Processing"],
  },
  {
    when: "2019 – 2022",
    type: "Industry",
    title: "Software Engineer",
    org: "Informatics International Pvt LTD, Colombo, Sri Lanka",
    desc: "Full-stack development on national-scale systems, e-passport infrastructure, government language integration, and case management platforms.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    when: "2017 – 2020",
    type: "Education",
    title: "B.Sc. Software Engineering",
    org: "NSBM University, Colombo, Sri Lanka",
    desc: "Bachelor's thesis on doctor–patient management software and its validation. Foundation in full-stack development and healthcare-oriented software.",
    stack: ["Java", "Python", "React", "MySQL"],
  },
];

const SKILL_GROUPS = [
  { name: "Languages",  items: ["Python", "TypeScript", "JavaScript", "Dart", "Java", "SQL"] },
  { name: "Frameworks", items: ["React", "Next.js", "Node.js", "Flutter", "PyTorch", "TensorFlow"] },
  { name: "ML / AI",    items: ["Federated Learning", "On-Device ML", "LLMs", "Signal Processing", "Self-Adaptive AI"] },
  { name: "Systems",    items: ["Docker", "Kubernetes", "PostgreSQL", "Redis", "REST/GraphQL"] },
  { name: "Domains",    items: ["mHealth", "Pediatric Care", "E-Governance", "Regulatory (MDR/GDPR)"] },
  { name: "Practice",   items: ["System Design", "Code Review", "Technical Writing", "Mentorship"] },
];

const AWARDS = [
  { yr: "2022", title: "National Recognition: SLRCMS Deployment", by: "Informatics International / Sri Lanka Ministry of Health" },
  { yr: "2024", title: "Finnish Software Engineering Doctoral Pilot", by: "University of Oulu / Finnish Government" },
];

const PUB_CATEGORIES = [
  { id: "all",         label: "All",                count: 8 },
  { id: "publications",label: "Publications",       count: 3 },
  { id: "prototypes",  label: "Prototypes",         count: 4 },
  { id: "talks",       label: "Talks & Writing",    count: 1 },
];

const PUBLICATIONS = [
  {
    cat: "publications", kind: "Conference Paper", year: "2025",
    venue: "TKTP 2025: Annual Doctoral Symposium of Computer Science, Helsinki",
    title: "Reducing Cognitive Overload in Software Engineers: A Design Science Approach",
    body: "Design science research on monitoring cognitive overload in software engineering using EEG and LLMs.",
    tags: ["EEG", "LLMs", "Design Science"],
    action: "PDF",
  },
  {
    cat: "publications", kind: "Thesis", year: "2024",
    venue: "University of Oulu: M.Sc. Thesis",
    title: "AI-Driven Mental Workload Monitoring and Well-Being Management in Workplace Settings",
    body: "AI-driven mental workload monitoring combining EEG and self-assessment data with LLM recommendations.",
    tags: ["EEG", "LLMs", "Well-being"],
    action: "PDF",
  },
  {
    cat: "publications", kind: "Thesis", year: "2020",
    venue: "NSBM University: B.Sc. Thesis",
    title: "Doctor–Patient Management Software and Its Validation",
    body: "AI-powered healthcare management system with automated prescription generation.",
    tags: ["Healthcare", "AI", "Validation"],
    action: "PDF",
  },
];

const POSTS = [
  {
    date: "4/14/2026",
    title: "Self-Adaptive AI for Healthcare: Balancing Personalization, Privacy, and Safety",
    excerpt: "Healthcare AI must adapt to individual patient contexts while preserving privacy and clinical safety. This post outlines a trustworthy path.",
  },
  {
    date: "4/14/2026",
    title: "Design Principles for Self-Adaptive AI: Monitor, Decide, Adapt, Verify",
    excerpt: "A practical blueprint for adaptive AI loops: continuous monitoring, policy-based decisions, safe adaptation, and post-change verification.",
  },
  {
    date: "4/14/2026",
    title: "Self-Adaptive AI in Real-World Systems: Why Static Models Fail",
    excerpt: "Static AI models degrade after deployment. Self-adaptive AI continuously senses drift, updates behavior, and preserves reliability in changing environments.",
  },
];

const CHAT_PROMPTS = [
  "What is Kavishwa's PhD research about?",
  "Which projects show production engineering experience?",
  "What topics can we collaborate on?",
  "Summarize Kavishwa's healthcare AI work.",
  "Show publications.",
];

Object.assign(window, {
  NAV_LINKS, HERO_STATS, ORIENT_CARDS, PERSPECTIVES, RESEARCH_AREAS, PROJECTS,
  JOURNEY, MILESTONES, FOCUS_AREAS, CV_STATS, CV_TIMELINE, SKILL_GROUPS, AWARDS,
  PUB_CATEGORIES, PUBLICATIONS, POSTS, CHAT_PROMPTS,
});
