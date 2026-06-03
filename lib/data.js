/* DATA, Kavishwa Wendakoon portfolio
   All content for sections lives here for easy edits. */

export const CV_URL = "/Wendakoon_CV_2026.pdf";

export const NAV_LINKS = [
  { id: "about",        label: "About" },
  { id: "research",     label: "Research" },
  { id: "projects",     label: "Projects" },
  { id: "cv",           label: "CV" },
  { id: "publications", label: "Publications" },
  { id: "blog",         label: "Blog" },
  { id: "contact",      label: "Contact" },
];

export const HERO_STATS = [
  { val: "PhD", lbl: "University of Oulu",  acc: true  },
  { val: "3+",  lbl: "Years Industry",       acc: false },
  { val: "10+", lbl: "Projects Shipped",     acc: false },
  { val: "5",   lbl: "Publications",         acc: false },
];

export const ORIENT_CARDS = [
  { idx: "01", title: "Research",     body: "What I study, why it matters, and where it's going.",      to: "research"     },
  { idx: "02", title: "Projects",     body: "Systems I've built and shipped.",                          to: "projects"     },
  { idx: "03", title: "CV",           body: "Where I've been and what I know.",                        to: "cv"           },
  { idx: "04", title: "Publications", body: "Papers, talks & prototypes.",                              to: "publications" },
  { idx: "05", title: "Contact",      body: "Get in touch or propose something.",                       to: "contact"      },
  { idx: "06", title: "Chat",         body: "Ask me anything about my work.",                           to: "chat"         },
];

export const PERSPECTIVES = [
  {
    id: "recruiters",
    name: "Recruiters",
    num: "01",
    title: "Researcher Who Builds Things and Ships Them",
    quote: "I'm equally at home in a research lab and a production environment. Most people have to pick one.",
    stats: [
      { v: "3+",  l: "Years Experience" },
      { v: "5",   l: "Publications" },
      { v: "10+", l: "Projects" },
    ],
    highlights: [
      "Three years shipping national-scale systems before starting my PhD at the University of Oulu. I know what production looks like.",
      "My PhD asks a hard question: how do you build AI that keeps working safely as clinical conditions change, and how do you prove it?",
      "Built government-grade systems used nationally in Sri Lanka: e-passport infrastructure, case management platforms, language integration.",
      "Full-stack across React, TypeScript, Node.js, Python, and Flutter. I design, build, and deploy.",
    ],
    cta: { label: "Download CV", primary: true, href: CV_URL, download: true },
    next: "collaborators",
  },
  {
    id: "collaborators",
    name: "Research Collaborators",
    num: "02",
    title: "Looking for People Who Care About the Same Problem",
    quote: "Clinical AI that adapts is powerful. Clinical AI that adapts without safeguards is dangerous. That's the problem I'm working on.",
    stats: [
      { v: "2", l: "Accepted Papers" },
      { v: "4", l: "Constraint Mechanisms" },
      { v: "7", l: "Stakeholder Evaluators" },
    ],
    highlights: [
      "Two accepted papers: a systematic review of self-adaptive AI in clinical decision support, and an architecture that governs adaptation through four constraint mechanisms.",
      "The architecture sits over the MAPE-K loop and adds safety bounds, validation gates, evidence anchoring, and audit/rollback, designed to survive clinical deployment.",
      "Currently building and simulating the prototype (Paper III). Looking for venues and co-authors in software engineering and medical informatics.",
      "Part of the FAST Finnish Software Engineering Doctoral Research Network, funded by the Finnish Ministry of Education and Culture.",
    ],
    cta: { label: "Propose a Collaboration", primary: true, href: "#contact" },
    next: "industry",
  },
  {
    id: "industry",
    name: "Industry Partners",
    num: "03",
    title: "Ship Trustworthy AI Into Production",
    quote: "I translate research-grade AI into systems that survive regulatory pressure, real scale, and clinical reality.",
    stats: [
      { v: "4", l: "National Systems" },
      { v: "10+", l: "Projects Shipped" },
      { v: "2", l: "Awards" },
    ],
    highlights: [
      "Built and shipped national systems: e-passport infrastructure for IOM Sri Lanka and a readmission case management platform used across the country.",
      "Full-stack delivery on React, TypeScript, Node, Python, and Flutter.",
      "My PhD comes with a hard constraint: the research has to work in real clinical environments, not just on paper.",
      "Turns compliance language (GDPR, MDR) into architecture decisions that engineering teams can actually implement.",
    ],
    cta: { label: "Start an Engagement", primary: true, href: "#contact" },
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
      "Happy to read and give feedback on thesis drafts in healthcare AI, mHealth, or trustworthy ML.",
      "Can talk through the gap between research and production. I've been on both sides.",
      "Curated reading lists for self-adaptive systems and clinical AI governance.",
      "Honest advice on building portfolios that hold up in both academic and industry applications.",
    ],
    cta: { label: "Ask a Question", primary: false, href: "#chat" },
    next: "recruiters",
  },
];

export const RESEARCH_AREAS = [
  {
    idx: "01",
    badge: "Primary Focus",
    title: "Self-Adaptive AI in Clinical Decision Support",
    body: "Clinical AI that learns and adapts after deployment is powerful, but also fragile. My research is about building the guardrails: systems that keep working safely even as patient populations, care protocols, and data distributions shift.",
    detail: "Paper I mapped the field; Paper II proposes a constraint layer over the MAPE-K loop. Paper III stress-tests whether those mechanisms actually hold when drift and adversarial feedback hit a running system.",
    tags: ["Runtime Adaptation Under Drift", "MAPE-K Architectures", "Safety Constraints"],
    cta: "Read more",
  },
  {
    idx: "02",
    title: "Runtime Governance & Accountability",
    body: "Adaptation without accountability is just risk by another name. I design constraint layers, audit mechanisms, and rollback policies so that when clinical AI changes its behavior, it does so traceably and within defined bounds.",
    detail: "Four mechanisms sit over the adaptation loop: hard safety bounds, validation gates before each update, evidence anchoring to clinical guidelines, and audit/rollback when behavior diverges from what was approved.",
    tags: ["Constraint Layer Design", "Audit/Rollback", "Evidence Anchoring"],
    papers: "1",
  },
  {
    idx: "03",
    title: "Trustworthy AI in Healthcare",
    body: "Trust in clinical AI isn't just about accuracy. It's about whether a clinician can understand, verify, and override a recommendation, especially when the stakes are high. I work on what that actually takes to build.",
    detail: "That means privacy-preserving design, calibrated trust (not blind acceptance), and explainability that survives safety-critical review, not dashboards that look convincing but can't be audited.",
    tags: ["Trust Calibration", "Privacy", "Safety-Critical Explainability"],
    papers: "1",
  },
  {
    idx: "04",
    title: "Empirical Software Engineering",
    body: "Good ideas need rigorous methods behind them. I use Design Science Research to build artifacts, evaluate them with mixed-methods studies, and stress-test them under simulation before claims reach publication or deployment.",
    detail: "Simulation injects concept drift and adversarial inputs; evaluation pairs quantitative degradation metrics with qualitative clinician feedback to see whether governance holds in practice, not only in theory.",
    tags: ["DSR Methodology", "Mixed-Methods Evaluation", "Simulation-Based Validation"],
    papers: "2",
  },
  {
    idx: "05",
    badge: "In Progress",
    title: "Governed Adaptation Prototype",
    body: "The Paper II architecture is becoming runnable code: a clinical decision support loop with MAPE-K adaptation, all four constraint mechanisms active, and an audit trail built in from day one, not bolted on after deployment.",
    detail: "Instantiation context is nurse-led primary-care triage. Target venue: EMSE or JSS. Comparing constrained vs. unconstrained baselines under drift is the core empirical question for 2026.",
    tags: ["Live MAPE-K Loop", "Drift Injection", "Ablation Study", "Nurse Triage"],
    prototypes: "1",
  },
];

export const PROJECTS = [
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

export const JOURNEY = [
  {
    year: "2022", num: "01", tag: "Foundation",
    title: "Monitoring", arrow: "→", title2: "Intervention",
    quote: "Watching a system fail and doing nothing about it isn't safety. It's observation. Systems need to act.",
  },
  {
    year: "2023", num: "02", tag: "Reframing",
    title: "Adaptation", arrow: "→", title2: "Constrained Adaptation",
    quote: "Unconstrained learning in clinical settings isn't a feature. It's a liability. Every update needs a boundary.",
  },
  {
    year: "2024", num: "03", tag: "Reframing",
    title: "Model Performance", arrow: "→", title2: "Trust & Accountability",
    quote: "A model that's accurate but unaccountable is still a black box. Clinicians need to understand, not just trust.",
  },
  {
    year: "2025", num: "04", tag: "Integration",
    title: "Theory", arrow: "→", title2: "Runnable Governance",
    quote: "An architecture that exists only in a paper hasn't been tested. Ideas need to run before they can be believed.",
  },
  {
    year: "2026+", num: "05", tag: "Current",
    title: "Individual Safety", arrow: "→", title2: "Systemic Clinical Governance",
    quote: "Making one component safe doesn't make the system safe. Governance has to be designed into the architecture, not patched in later.",
  },
];

export const MILESTONES = [
  { yr: "22", lbl: "Foundation" },
  { yr: "23", lbl: "Reframing" },
  { yr: "25", lbl: "Integration" },
  { yr: "26", lbl: "Current" },
];

export const FOCUS_AREAS = [
  {
    id: "investigating",
    num: "01",
    title: "What I'm investigating",
    preview: "How to let clinical AI adapt without letting it adapt itself into danger.",
    body: "Clinical AI adapts: it updates its models, shifts its recommendations, responds to new data. That flexibility is also its main risk. My research asks how you let a system learn without letting it learn itself into a place where it causes harm.",
    deep: "Paper II (accepted) proposes a Constraint Layer that sits over the MAPE-K adaptation loop. Four mechanisms keep adaptation safe: hard safety bounds, validation gates before each update, evidence anchoring to clinical guidelines, and audit/rollback when things go wrong. Paper III is now stress-testing this under simulated concept drift and adversarial inputs to see if the constraints actually hold.",
    tags: ["Self-Adaptive AI", "MAPE-K Architecture", "Runtime Governance", "Safety Constraints"],
    related: "Doctoral Research, Papers I & II",
    quote: "Adaptation without governance is just drift by another name.",
  },
  {
    id: "building",
    num: "02",
    title: "What I'm building",
    preview: "A working prototype of the safety-constrained adaptive architecture.",
    body: "Right now I'm turning the Paper II architecture into code: a working adaptive clinical decision support system with a live MAPE-K loop, all four constraint mechanisms active, and an audit trail that's built in from day one, not bolted on afterwards.",
    deep: "The Paper III prototype injects concept drift and adversarial feedback to measure how the constrained system degrades compared to an unconstrained baseline. The instantiation context is nurse-led primary-care triage. Target venue: EMSE or JSS.",
    tags: ["Prototype", "Simulation Evaluation", "Drift Injection", "Ablation Study"],
    related: "Paper III (May–Sep 2026)",
    quote: "An architecture that can't be stress-tested isn't an architecture. It's a proposal.",
  },
  {
    id: "questioning",
    num: "03",
    title: "What I'm questioning",
    preview: "Whether existing AI governance frameworks can handle a system that keeps learning.",
    body: "Most AI governance frameworks assume the model stays fixed after deployment. Clinical AI doesn't. Once it's running, it drifts, retrains, and adapts, and most frameworks have almost nothing to say about governing that process safely.",
    deep: "Paper I (accepted) reviewed 20 studies across the field. The finding was consistent: researchers acknowledge that adaptive AI drifts, but rigorous software engineering methods for constraining, auditing, and rolling back that drift in safety-critical settings are still largely absent.",
    tags: ["SLR Findings", "Governance Gaps", "Post-Deployment Adaptation", "Safety-Critical AI"],
    related: "Paper I, Systematic Review",
    quote: "A framework that only governs a model at training time ignores most of its actual lifespan.",
  },
  {
    id: "open",
    num: "04",
    title: "What I'm open to",
    preview: "Clinical sites, co-authors, and people who want to build things that matter.",
    body: "I'm always interested in talking to clinical sites, potential co-authors, and engineers who care about getting trustworthy AI into real workflows. Paper IV will involve real clinicians. If that could be you or your institution, reach out early.",
    deep: "I bring both sides: the doctoral framing and the engineer who has shipped national-scale systems into production. If your work sits at the intersection of clinical AI and software engineering, I want to hear about it.",
    tags: ["Co-Authorship", "Clinical Study Sites", "Student Mentorship", "Industry Partnership"],
    related: "Open Calls 2026",
    quote: "The systems I want to build need more hands than mine.",
  },
];

export const CV_STATS = [
  { v: "3+",  l: "Years in Industry" },
  { v: "10+", l: "Projects Shipped" },
  { v: "4",   l: "National-Scale Systems" },
  { v: "2",   l: "Awards" },
];

export const CV_TIMELINE = [
  {
    when: "2024 – Now",
    type: "Research",
    title: "Doctoral Researcher",
    org: "University of Oulu, Finland",
    desc: "FAST-funded PhD at the Faculty of ITEE, supervised by Nirnaya Tripathi. The research question: how do you make adaptive AI in clinical decision support trustworthy enough to actually deploy, and how do you prove it?",
    bullets: [
      "Paper I (accepted): a systematic review of self-adaptive AI in medical software, mapping where the field stands and where the engineering gaps are.",
      "Paper II (accepted): a safety-constrained architecture with a Constraint Layer over the MAPE-K loop: four mechanisms that keep adaptation within safe bounds, evaluated with clinical stakeholders (n=7).",
      "Paper III (in progress): building and simulating the prototype under concept drift and adversarial conditions to stress-test the constraint mechanisms against an unconstrained baseline.",
      "Paper IV (planned): a mixed-methods clinician study on how adaptive AI affects trust, reliance, and clinical decision-making (16–24 participants, target JAMIA/JBI).",
    ],
    stack: ["Python", "Self-Adaptive AI", "MAPE-K", "Design Science Research", "Simulation"],
  },
  {
    when: "2022 – 2024",
    type: "Education",
    title: "M.Sc. Software Engineering",
    org: "University of Oulu, Finland",
    desc: "Master's thesis on detecting and responding to mental workload in real work settings, combining EEG signals with LLM-driven recommendations to support engineer well-being.",
    stack: ["EEG", "LLMs", "Python", "Signal Processing"],
  },
  {
    when: "2019 – 2022",
    type: "Industry",
    title: "Software Engineer",
    org: "Informatics International Pvt LTD, Colombo, Sri Lanka",
    desc: "Full-stack engineer on national-scale government systems: e-passport infrastructure for IOM Sri Lanka, multilingual government platforms, and a readmission case management system used across the country.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    when: "2017 – 2020",
    type: "Education",
    title: "B.Sc. Software Engineering",
    org: "NSBM University, Colombo, Sri Lanka",
    desc: "Bachelor's thesis on AI-powered doctor–patient management software. Built and validated a system for managing patient records and automating prescription generation.",
    stack: ["Java", "Python", "React", "MySQL"],
  },
];

export const SKILL_GROUPS = [
  { name: "Languages",  items: ["Python", "TypeScript", "JavaScript", "Dart", "Java", "SQL"] },
  { name: "Frameworks", items: ["React", "Next.js", "Node.js", "Flutter", "PyTorch", "TensorFlow"] },
  { name: "ML / AI",    items: ["Self-Adaptive AI", "On-Device ML", "LLMs", "Signal Processing", "Federated Learning"] },
  { name: "Systems",    items: ["Docker", "Kubernetes", "PostgreSQL", "Redis", "REST/GraphQL"] },
  { name: "Domains",    items: ["Clinical Decision Support", "mHealth", "E-Governance", "Regulatory (MDR/GDPR)"] },
  { name: "Practice",   items: ["System Design", "Code Review", "Technical Writing", "Mentorship"] },
];

export const AWARDS = [
  { yr: "2022", title: "National Recognition, SLRCMS Deployment", by: "Informatics International / Sri Lanka Ministry of Health" },
  { yr: "2024", title: "Finnish Software Engineering Doctoral Pilot", by: "University of Oulu / Finnish Government" },
];

export const PUB_CATEGORIES = [
  { id: "all",         label: "All",                count: 5 },
  { id: "publications",label: "Publications",       count: 5 },
  { id: "prototypes",  label: "Prototypes",         count: 4 },
  { id: "talks",       label: "Talks & Writing",    count: 1 },
];

export const PUBLICATIONS = [
  {
    cat: "publications", kind: "Conference Paper", year: "2026",
    venue: "Accepted, peer-reviewed conference paper",
    title: "A Safety-Constrained Architecture for Adaptive Clinical Decision Support",
    body: "Built using Design Science Research, this architecture adds a Constraint Layer to the MAPE-K adaptation loop: four mechanisms that let clinical AI adapt without losing accountability. Evaluated with seven clinical stakeholders in a nurse-led triage setting.",
    tags: ["DSR", "MAPE-K", "Runtime Governance", "CDSS", "Safety Constraints"],
    action: "PDF",
  },
  {
    cat: "publications", kind: "Journal / Conference Paper", year: "2025",
    venue: "Accepted, peer-reviewed publication",
    title: "Self-adaptive AI in Clinical Decision Support: A Systematic Review",
    body: "A systematic review of how self-adaptive AI is being built for clinical settings. Using PRISMA and Kitchenham across 20 primary studies, it maps what's been tried, what's working, and, crucially, where the engineering and governance approaches fall short.",
    tags: ["SLR", "PRISMA", "Self-Adaptive AI", "CDSS", "Governance Gap"],
    action: "PDF",
  },
  {
    cat: "publications", kind: "Conference Paper", year: "2025",
    venue: "TKTP 2025, Annual Doctoral Symposium of Computer Science, Helsinki",
    title: "Reducing Cognitive Overload in Software Engineers: A Design Science Approach",
    body: "Can we detect when a software engineer is cognitively overwhelmed before they make mistakes? This paper uses EEG and LLMs to monitor and respond to mental overload in real work settings.",
    tags: ["EEG", "LLMs", "Design Science"],
    action: "PDF",
  },
  {
    cat: "publications", kind: "Thesis", year: "2024",
    venue: "University of Oulu, M.Sc. Thesis",
    title: "AI-Driven Mental Workload Monitoring and Well-Being Management in Workplace Settings",
    body: "Using EEG and self-reported data to track mental workload in real time, with an LLM that suggests personalised well-being interventions based on what the signals show.",
    tags: ["EEG", "LLMs", "Well-being"],
    action: "PDF",
  },
  {
    cat: "publications", kind: "Thesis", year: "2020",
    venue: "NSBM University, B.Sc. Thesis",
    title: "Doctor–Patient Management Software and Its Validation",
    body: "An AI-powered system for managing patient records and automating prescription generation, designed, built, and validated as part of a B.Sc. in Software Engineering.",
    tags: ["Healthcare", "AI", "Validation"],
    action: "PDF",
  },
];

export const POSTS = [
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

export const CHAT_PROMPTS = [
  "What's the PhD actually trying to solve?",
  "What national-scale systems has he shipped?",
  "How does the MAPE-K constraint layer work?",
  "What's open for collaboration in 2026?",
  "Which papers are accepted vs in progress?",
];
