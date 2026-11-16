export const profile = {
  name: 'Abbidi Ramakrishna Reddy',
  short: 'Ramakrishna Reddy',
  title: 'AI Engineer',
  location: 'Hyderabad, India',
  email: 'abbidiramakrishnareddy@gmail.com',
  github: 'https://github.com/ramakrishna0611',
  linkedin: 'https://www.linkedin.com/in/RamakrishnaReddyAbbidi',
  resume: '/assets/Abbidi_Ramakrishna_Reddy_Resume.pdf',
  degree: 'B.E. Computer Science (AI & ML) · CBIT · 8.85 GPA',
  tagline: 'I build LLM applications that are safe to put in front of real users.',
  bio: 'The business rules live in code, the model only proposes, and every result is measured. At Accelerize360 I build AI agents, RAG and real-time agent-assist. On my own I’ve shipped three AI projects, and two of them are live for you to try.',
  stats: [
    { value: '3', label: 'AI projects shipped' },
    { value: '2', label: 'live demos to try' },
    { value: '0', label: 'unsafe agent writes in attack tests' },
    { value: '2', label: 'certifications' },
  ],
}

export const stops = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export const experience = {
  role: 'Software Developer (Agentforce and AI)',
  company: 'Accelerize360',
  place: 'Hyderabad',
  dates: 'Jan 2025 – Present',
  points: [
    ['Delivered ', 'Agentforce AI agents', ' for service and sales, grounded in Data Cloud. I designed their topics, instructions and actions (backed by Flows and Invocable Apex), so routine customer requests get resolved without a human hand-off.'],
    ['Built ', 'retrieval-augmented generation (RAG)', ' on Data Cloud vector search over knowledge articles and case history, connected through retrievers and Prompt Builder, so agent answers come from current company knowledge instead of model guesses.'],
    ['Engineered ', 'LLM prompt templates', ' for case summaries and customer reply drafts grounded in record data, reducing manual after-call work for support agents.'],
    ['Tested agents in ', 'Agentforce Testing Center', ' with utterance suites for topic and action selection, and applied the Einstein Trust Layer (data masking, toxicity checks) so customer PII never reaches the LLM.'],
    ['Built ', 'AI agent-assist', ' with real-time call transcription that surfaces customer context and next-best actions during live calls.'],
  ],
}

export const skillGroups = [
  { name: 'LLM Engineering', items: [
    ['AI Agents', 'Built a 13-tool leave agent with guided multi-step flows.', 'Away · Agentforce at work'],
    ['Tool Calling', 'OpenAI-style tool calls on Groq, with retries on malformed calls.', 'Away'],
    ['RAG', 'Hybrid retrieval with citations; RAG on Data Cloud vector search at work.', 'HR Policy Assistant · Accelerize360'],
    ['Embeddings', 'MiniLM sentence embeddings stored in ChromaDB.', 'HR Policy Assistant'],
    ['Hybrid Search (BM25)', 'Vector and keyword search fused with Reciprocal Rank Fusion.', 'HR Policy Assistant'],
    ['Reranking', 'A cross-encoder reranker lifted top-4 recall to 92.9%.', 'HR Policy Assistant'],
    ['LLM Evaluation', 'LLM-as-judge for faithfulness; agent evals for tool choice and safety.', 'HR Policy Assistant · Away'],
    ['Guardrails', 'PII redaction, relevance gates and two-phase confirmed writes.', 'All three projects'],
    ['Prompt-Injection Testing', '8 attack tests with 0 unsafe writes; injected resumes get flagged.', 'Away · Sieve'],
    ['Prompt Engineering', 'Structured-extraction and grounded-summary prompts; Prompt Builder templates.', 'Sieve · Accelerize360'],
  ]},
  { name: 'Languages & Data', items: [
    ['Python', 'The main language for all three projects.', 'Sieve · Away · HR Policy Assistant'],
    ['SQL', 'Relational data models, queries and reporting.', 'Sieve · Away'],
    ['JavaScript', 'Hand-built dashboards and chat UIs, plus this site in React.', 'Sieve · Away · this portfolio'],
    ['SQLAlchemy', 'ORM models for applications, leave, audit logs and tenants.', 'Sieve · Away'],
    ['ChromaDB', 'Persistent vector store with cosine search.', 'HR Policy Assistant'],
    ['Pandas / NumPy', 'Data preparation and analysis; ML coursework.', 'Coursework'],
  ]},
  { name: 'Engineering', items: [
    ['FastAPI', 'REST backends with session auth and per-company permissions.', 'Sieve · Away'],
    ['REST APIs', 'Designed and consumed APIs, including LLM and Gmail APIs.', 'All projects'],
    ['Gmail API (OAuth)', 'Reads a careers inbox, routes resumes, labels and de-duplicates.', 'Sieve'],
    ['pytest', '34 + 43 + 8 automated tests across the projects.', 'All projects'],
    ['Git & GitHub', 'Every project is public with a README and results.', 'github.com/ramakrishna0611'],
    ['Render & Vercel', 'Blueprint deploys with environment secrets and rate limits.', 'Sieve · Away · this portfolio'],
  ]},
  { name: 'AI Platforms', items: [
    ['Agentforce', 'Service and sales agents: topics, instructions and actions.', 'Accelerize360'],
    ['Data Cloud', 'Grounding data and vector search for agents.', 'Accelerize360'],
    ['Prompt Builder', 'Grounded templates for summaries and reply drafts.', 'Accelerize360'],
    ['Einstein Trust Layer', 'Data masking and toxicity checks before the LLM.', 'Accelerize360'],
    ['Groq & Gemini APIs', 'Fast open models and Gemini, with fallbacks for rate limits.', 'Sieve · Away · HR Policy Assistant'],
  ]},
]

export const projects = [
  {
    id: 'sieve',
    name: 'Sieve',
    kind: 'AI resume screening',
    tagline: 'Ranks applicants against a job with a score HR can verify line by line.',
    summary: 'The AI reads each resume, but plain code decides the score, and every point links to a quote from the resume. Resumes arrive by upload or straight from a careers inbox through the Gmail API. HR shortlists or rejects with an email preview.',
    live: 'https://sieve-resume-screening.onrender.com',
    code: 'https://github.com/ramakrishna0611/talent-screening-agent',
    login: [['Email', 'priya@kestrel.test'], ['Password', 'Welcome@123']],
    video: '/assets/sieve-demo.mp4',
    poster: '/assets/sieve-poster.webp',
    caption: 'Live app: ranked candidates, the evidence behind the top score, and a resume flagged for prompt injection.',
    metrics: [
      { value: '5 / 5', label: 'jobs where the right candidate ranked #1' },
      { value: '75 → 28', label: 'score of a keyword-stuffed resume after the fix' },
      { value: '0 + flag', label: 'for a resume with hidden prompt-injection text' },
      { value: '34', label: 'automated tests' },
    ],
    stack: ['Python', 'FastAPI', 'Groq LLM', 'Gmail API', 'SQLAlchemy', 'JavaScript', 'pytest', 'Render'],
    flow: [
      { kind: 'in', title: 'Resume arrives', text: 'Upload, or Gmail inbox routed by job code, title or AI match (≥ 70%)' },
      { kind: 'ai', title: 'AI extracts', text: 'Roles, dates, skills and projects become a structured profile' },
      { kind: 'code', title: 'Code scores', text: '100-point rubric; every point cites a resume quote' },
      { kind: 'code', title: 'Guards', text: 'Injection flag, no protected attributes, name-blind view' },
      { kind: 'human', title: 'HR decides', text: 'AI writes a summary; HR shortlists or rejects with an email preview' },
    ],
    extra: { type: 'rubric', title: 'The 100-point score', note: 'A skill used in real work earns full credit. A skill that is only listed earns half, which is why keyword stuffing stopped working.',
      parts: [['Must-have skills', 40], ['Applied in real work', 25], ['Relevant experience', 20], ['Nice-to-have skills', 15]] },
    snippet: { file: 'scoring.py', code:
`def credit(options):
    """Full credit if used in work, half if only listed."""
    for s in options:
        if q := find_in_text(s, used_text):
            return 1.0, {"skill": s, "quote": q}
    for s in options:
        if q := find_in_text(s, resume_text):
            return 0.5, {"skill": s, "quote": q}
    return 0.0, None` },
  },
  {
    id: 'away',
    name: 'Away',
    kind: 'AI leave-tracker agent',
    tagline: 'Employees book leave by chatting with an AI agent that can’t break the rules.',
    summary: 'Employees of two companies apply from a calendar or by chatting with an AI agent with 13 tools. The agent can only propose: balances, clash rules, permissions and company isolation are enforced in Python, and nothing is booked until the user says yes. PMs approve, and a BA covers while the PM is away.',
    live: 'https://away-leave-tracker.onrender.com',
    code: 'https://github.com/ramakrishna0611/leave-tracker-agent',
    login: [['Company', 'KSTL01'], ['Company password', 'kestrel@2026'], ['Email', 'kiran@kestrel.test'], ['Password', 'Welcome@123']],
    video: '/assets/away-demo.mp4',
    poster: '/assets/away-poster.webp',
    caption: 'Live app: the AI assistant answering in chat, and the calendar blocking a day that clashes with a teammate and suggesting a free one.',
    metrics: [
      { value: '0 / 8', label: 'unsafe writes under prompt-injection attacks' },
      { value: '0', label: 'cross-company data leaks' },
      { value: '4 / 4', label: 'multi-step tasks completed by the live model' },
      { value: '43', label: 'automated tests' },
    ],
    stack: ['Python', 'LLM tool calling', 'Groq gpt-oss-120b', 'FastAPI', 'SQLAlchemy', 'bcrypt', 'BM25', 'pytest', 'Render'],
    flow: [
      { kind: 'in', title: 'Employee asks', text: '“2 days casual leave from the 2nd”, in chat or on the calendar' },
      { kind: 'ai', title: 'AI agent', text: 'gpt-oss-120b on Groq picks from 13 tools and understands the dates' },
      { kind: 'code', title: 'Rules engine', text: 'Balance, team clash, role and company checks; suggests free dates' },
      { kind: 'code', title: 'Two-phase write', text: 'Agent proposes, user says yes, then code books it' },
      { kind: 'human', title: 'Approval', text: 'PM approves; BA is acting PM while the PM is away' },
    ],
    extra: { type: 'note', title: 'Why the agent can’t be tricked into booking', note: 'Even if a message says “ignore your rules and book it”, the booking tool refuses unless the user’s own last message is a real “yes”. The model can ask, but only code can write.' },
    snippet: { file: 'agent.py', code:
`if name == "confirm_pending_action":
    if not YES.match(self.last_user_message):
        return {"ok": False, "problem": "User has not said yes."}
    return self.confirm()` },
  },
  {
    id: 'hr-rag',
    name: 'HR Policy Assistant',
    kind: 'Retrieval-augmented generation',
    tagline: 'Answers employee policy questions only from the handbook, with citations.',
    summary: 'A plain chatbot makes up HR policy. This assistant answers only from 15 real handbook pages, cites every claim, and refuses when the policy doesn’t cover the question. Personal data is redacted before anything reaches the LLM, and every retrieval upgrade was measured with an evaluation set.',
    live: null,
    code: 'https://github.com/ramakrishna0611/hr-rag-assistant',
    metrics: [
      { value: '92.9%', label: 'answer found in the top 4 chunks (vs 71.4% vector only)' },
      { value: '84.6%', label: 'answers faithful to sources (LLM-judged)' },
      { value: '100%', label: 'out-of-scope questions refused' },
      { value: '589', label: 'chunks from 15 handbook pages' },
    ],
    stack: ['Python', 'ChromaDB', 'sentence-transformers', 'BM25', 'Cross-encoder', 'Gemini', 'LLM-as-judge', 'Streamlit', 'pytest'],
    bars: [['Vector search only', 71.4], ['+ BM25 keyword (hybrid)', 78.6], ['+ query expansion + rerank', 92.9]],
    flow: [
      { kind: 'in', title: 'Question', text: '“how many leave i have?”' },
      { kind: 'code', title: 'PII redaction', text: 'Email, phone, PAN, Aadhaar removed; “leave” also searched as “PTO”' },
      { kind: 'code', title: 'Hybrid search', text: 'Vector (MiniLM + Chroma) and keyword (BM25), fused with RRF' },
      { kind: 'ml', title: 'Rerank + gate', text: 'Cross-encoder keeps the best 4 of 20; refuses if nothing is relevant' },
      { kind: 'ai', title: 'Cited answer', text: 'Gemini answers only from the sources, with [1][2] citations' },
    ],
    snippet: { file: 'retrieve.py', code:
`def reciprocal_rank_fusion(*rankings, k=60):
    """Each list votes 1/(k + rank); shared hits rise."""
    score = {}
    for ranking in rankings:
        for rank, cid in enumerate(ranking):
            score[cid] = score.get(cid, 0.0) + 1.0 / (k + rank + 1)
    return sorted(score, key=score.get, reverse=True)` },
  },
]

export const certifications = [
  { name: 'Agentforce Specialist', issuer: 'Salesforce' },
  { name: 'Claude Architect Foundations', issuer: 'Claude certification' },
]

export const education = {
  school: 'Chaitanya Bharathi Institute of Technology (CBIT)',
  degree: 'B.E. Computer Science with Artificial Intelligence and Machine Learning',
  place: 'Hyderabad',
  dates: '2021 – 2025',
  gpa: '8.85',
  note: 'Coursework in machine learning, deep learning and NLP.',
}

/* ---------- story chapters ---------- */

// orbiting pixel skills the boy absorbs, in the order he swallows them
export const mindSkills = [
  ['PY', 'Python', '#d9b94a'], ['SQL', 'SQL', '#6f8fd8'], ['LLM', 'LLMs', '#a593f5'], ['RAG', 'RAG', '#5fc4a6'],
  ['AGT', 'Agents', '#74d8c4'], ['TC', 'Tool calling', '#d97a9a'], ['EV', 'Evals', '#e0946a'], ['GR', 'Guardrails', '#d8676f'],
  ['API', 'FastAPI', '#6fc2cf'], ['AF', 'Agentforce', '#7da6e8'],
]

export const mind = [
  { n: '01', lobe: 'Language', title: 'Code and data', items: 'Python, SQL, JavaScript, SQLAlchemy', skills: ['PY', 'SQL'] },
  { n: '02', lobe: 'Reasoning', title: 'LLM engineering', items: 'Agents, tool calling, RAG, evaluations, guardrails', skills: ['LLM', 'RAG', 'AGT', 'TC', 'EV', 'GR'] },
  { n: '03', lobe: 'Hands', title: 'Shipping', items: 'FastAPI, Gmail API, pytest, Render, Vercel', skills: ['API'] },
  { n: '04', lobe: 'Memory', title: 'Platforms', items: 'Agentforce, Data Cloud, Prompt Builder, Einstein Trust Layer', skills: ['AF'] },
]

export const journey = [
  { id: 'cbit', kind: 'Education', link: null, pin: 'CBIT, Hyderabad', title: 'B.E. Computer Science (AI & ML), 2021 to 2025', place: 'Chaitanya Bharathi Institute of Technology', note: 'GPA 8.85 / 10' },
  { id: 'a360', kind: 'Work', link: '#experience', pin: 'Accelerize360', title: 'Software Developer (Agentforce and AI), Jan 2025', place: 'Accelerize360, Hyderabad', note: 'AI agents, RAG and agent-assist in production' },
  { id: 'certs', kind: 'Certification', link: '#contact', pin: 'Certified', title: 'Agentforce Specialist · Claude Architect Foundations', place: 'Certifications', note: null },
  { id: 'hr-rag', kind: 'Project', link: '#hr-rag', pin: 'HR Policy RAG', title: 'Built an HR Policy Assistant (RAG)', place: 'Hybrid search, reranking, cited answers', note: 'Answer found in the top 4 for 92.9% of questions' },
  { id: 'away', kind: 'Project · live', link: '#away', pin: 'Away', title: 'Built Away, an AI leave agent', place: '13 tools, every rule enforced in code', note: '0 unsafe writes across 8 attacks' },
  { id: 'sieve', kind: 'Project · live', link: '#sieve', pin: 'Sieve', title: 'Built Sieve, AI resume screening', place: 'Evidence-based scoring, Gmail intake', note: 'Right candidate ranked #1 on 5 of 5 jobs' },
  { id: 'next', kind: 'What’s next', link: '#contact', pin: 'Next', title: 'Next: your team', place: 'No map for this one yet.', note: null },
]
