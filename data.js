// All portfolio content lives here. Edit this file to change what the pages show.
window.DATA = {
  name: "Abhishek Sahu",
  handle: "abhishek",
  role: "Full-Stack Developer · CSE Undergrad",
  location: "Kanpur, Uttar Pradesh, India",
  email: "sahuabhishek2953@gmail.com",
  phone: "+91 7355059167",
  github: "https://github.com/sahuabhishek2953-rgb",
  linkedin: "https://www.linkedin.com/in/abhishek-sahu-104422344",
  leetcode: "Abhishek_788",
  resume: "assets/Abhishek_Sahu_Resume.pdf",
  photo: "assets/img/profile.jpg?v=3",

  summary:
    "Results-oriented Computer Science and Engineering student with hands-on experience in full-stack web development using React.js, Redux Toolkit, Node.js, and PostgreSQL/MongoDB. Proficient in Java, Python, JavaScript and Object-Oriented Programming, with strong DSA skills demonstrated through 300+ solved coding problems. Experienced in building and deploying RESTful APIs, real-time features, and database-driven applications across multiple production-quality platforms.",

  skills: {
    "Languages": ["Java", "Python", "JavaScript", "C"],
    "Frontend": ["React.js", "Redux Toolkit", "HTML5", "CSS3", "Tailwind CSS", "JavaScript (ES6+)"],
    "Backend": ["Node.js", "Express.js", "Supabase", "Socket.io", "REST APIs"],
    "Databases": ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis"],
    "Tools & Platforms": ["Git", "GitHub", "VS Code", "Postman", "Vercel"],
    "Core CS": ["OOP", "DSA", "DBMS", "Operating Systems", "Computer Networks", "SDLC"]
  },

  education: [
    {
      school: "Maharana Pratap Engineering College, Kanpur",
      degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
      years: "2023 – 2027",
      score: "SGPA: 7.5"
    }
  ],

  projects: [
    {
      name: "JobArena",
      tagline: "Full-stack job portal platform",
      desc: "A full-loop job portal with Role-Based Access Control: recruiters post and manage listings while seekers search, apply and track application status.",
      points: [
        "Resume upload and storage alongside a structured application pipeline, with recruiter and seeker views cleanly separated by role.",
        "PostgreSQL schema designed via Supabase to support relational queries across job postings, applications and user roles."
      ],
      stack: ["React", "Supabase", "PostgreSQL", "RBAC"],
      repo: "",
      live: "https://job-arena.vercel.app"
    },
    {
      name: "FoodArena",
      tagline: "Unified food, grocery & dining platform",
      desc: "One platform that merges Food Delivery, Grocery and Dining with a single shared cart across all three services.",
      points: [
        "Dietary-profile filtering (Keto, Vegan, Family Thali) and a transparent pricing breakdown with itemised commission and delivery fees.",
        "Cart sharing via shareable links, pre-order scheduling with 30-minute slots, and a gamified achievement system with 7+ progress-tracked badges."
      ],
      stack: ["React 18", "Redux Toolkit", "Vite", "Tailwind CSS"],
      repo: "https://github.com/sahuabhishek2953-rgb/Food-Arena",
      live: "https://food-arena-eight.vercel.app/"
    },
    {
      name: "CodeArena",
      tagline: "Competitive programming platform",
      desc: "A MERN-stack competitive programming platform with a glassmorphism UI, live contests and a secure code-execution engine.",
      points: [
        "Live contests with a split-pane editor and real-time Socket.io chat.",
        "Multi-language execution (C++, Java, Python, JavaScript), server-side pagination and filtering across the problem library.",
        "30-day activity graphs (Recharts), global leaderboard, and an admin dashboard for problems, test cases and Cloudinary-hosted video solutions."
      ],
      stack: ["MongoDB", "Express", "React", "Node.js", "Socket.io", "Redis", "Cloudinary", "Tailwind"],
      repo: "https://github.com/sahuabhishek2953-rgb/CodeArena",
      live: "https://code-arena-dun-nu.vercel.app/"
    },
    {
      name: "MedNexa",
      tagline: "AI prescription digitization for clinics",
      desc: "AI-powered prescription digitization and patient-history platform for small clinics and private doctors.",
      points: [
        "Drag & drop prescription upload → Tesseract OCR → Gemini Flash corrects errors and extracts doctor, medicines, dosages and diagnosis.",
        "Doctor review workflow (edit / approve / reject), patient management, AI tags and summaries, and an OCR confidence indicator."
      ],
      stack: ["Next.js 15", "TypeScript", "Tailwind v4", "Drizzle ORM", "Neon PostgreSQL", "Tesseract.js", "Gemini"],
      repo: "https://github.com/sahuabhishek2953-rgb/MedNexa",
      live: "https://mednexa-six.vercel.app/"
    },
    {
      name: "RailYatra",
      tagline: "Live Indian Railways tracking & journey intelligence",
      desc: "Real-time train tracking with interactive vector maps, terrain elevation charts, live speed computation, nearby landmark discovery and arrival geofencing.",
      points: [
        "MapLibre GL dark map with dual-colour track progress, animated train marker and station popups; SRTM 30m elevation profile via Recharts.",
        "Per-station delay history, weather companion, installable offline-ready PWA, and shareable journey links.",
        "Monorepo: React 18 + Vite frontend (Vercel), Fastify 5 + TypeScript API (Render), Docker images on Docker Hub."
      ],
      stack: ["TypeScript", "React 18", "Vite", "Fastify", "MapLibre GL", "Tailwind v4", "Zustand", "Docker"],
      repo: "https://github.com/sahuabhishek2953-rgb/RailYatra",
      live: "https://railyatra-orpin.vercel.app/"
    }
  ],

  hackathons: [
    {
      name: "Spark – The Startup Conclave",
      result: "First Runner-up",
      meta: "Grand Finale · Team CodeTitan · ₹30,000 prize",
      desc: "Organised by MPGI with FICCI FLO Kanpur and TiE UP. Placed First Runner-up.",
      img: "assets/certs/spark.jpg",
      extra: "assets/img/champions.jpg"
    },
    {
      name: "Build With Bharat 4.0",
      result: "Offline round participant",
      meta: "National-level · KCC ITM, Greater Noida · 10–11 Oct 2026 · Team CodeTitan",
      desc: "Qualified for and took part in the offline round, organised by CodeVerse.",
      img: "assets/certs/bwb.jpg"
    },
    {
      name: "RIFT '26 Hackathon",
      result: "Certificate of Appreciation",
      meta: "PW Institute of Innovation · 19–20 Feb 2026 · Team CodeTitan",
      desc: "Participated actively in the RIFT '26 hackathon.",
      img: "assets/certs/rift.jpg"
    },
    {
      name: "HackVega 2.0",
      result: "Participant",
      meta: "Nationwide · mycareernet · 47,000+ engineering students",
      desc: "Competed against 47,000+ engineering students from the 2026–2029 graduating cohorts.",
      img: "assets/certs/hackvega.jpg"
    }
  ],

  alsoRecognised: ["CodeRush", "Hacknovate 7.0", "Smart India Hackathon (SIH) 2025", "PW IOI"],

  achievements: [
    { icon: "🥈", title: "First Runner-up — Spark Startup Conclave 2026", text: "Won ₹30,000 with team CodeTitan at the national/inter-college startup conclave." },
    { icon: "🏅", title: "Appreciation at national-level hackathons", text: "CodeRush, Hacknovate 7.0, Smart India Hackathon (SIH) 2025 and PW IOI." },
    { icon: "🧠", title: "300+ DSA problems solved", text: "Across competitive-programming platforms: arrays, strings, trees and more." },
    { icon: "🔥", title: "LeetCode 100 Days Badge 2026", text: "Solved problems on 100+ days in 2026 (LeetCode: Abhishek_788)." },
    { icon: "☕", title: "NPTEL Elite — Programming in Java", text: "83% consolidated score, IIT Kharagpur (Jul–Oct 2025)." }
  ],

  certificates: [
    { title: "Programming in Java (Elite)", issuer: "NPTEL · IIT Kharagpur", date: "Jul–Oct 2025", note: "83% · 12-week course", img: "assets/certs/nptel-java.jpg", file: "assets/certs/nptel-java.pdf" },
    { title: "Power BI Micro Course", issuer: "Skill Course", date: "27 Dec 2025", note: "ISO 9001:2015 certified", img: "assets/certs/powerbi.jpg" },
    { title: "Applied Marketing in Higher Education and Upskilling", issuer: "Jaro Education", date: "29 Sep 2026", note: "", img: "assets/certs/marketing.jpg" },
    { title: "LeetCode 100 Days Badge 2026", issuer: "LeetCode", date: "2026", note: "Solving problems 100+ days", img: "assets/certs/leetcode100.jpg" }
  ]
};
