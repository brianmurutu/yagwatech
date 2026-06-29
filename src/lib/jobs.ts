export interface JobPosition {
  id: string;
  title: string;
  category: "Development" | "Design" | "Marketing" | "Systems";
  location: string;
  type: string;
  salary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export const jobPositions: JobPosition[] = [
  {
    id: "snr-fullstack-dev",
    title: "Senior Fullstack Engineer (React / Next.js / Node)",
    category: "Development",
    location: "Nairobi, Kenya (Hybrid - 2 days office, 3 days remote)",
    type: "Full-time",
    salary: "Competitive, based on experience",
    description: "We are looking for a Senior Fullstack Engineer who is passionate about building high-quality, performant React and Next.js applications, and secure REST/GraphQL API backends in Node.js.",
    responsibilities: [
      "Architect, develop, and maintain Next.js web applications and Node.js APIs.",
      "Work closely with our designers and product managers to deliver polished, responsive user interfaces.",
      "Optimize website performance, load times, and SEO scores to premium standards.",
      "Write clean, modular, and maintainable TypeScript code with unit and integration tests.",
      "Mentor junior team members and participate in code reviews."
    ],
    requirements: [
      "4+ years of professional software development experience.",
      "Strong proficiency in JavaScript, TypeScript, React, Next.js, and Node.js.",
      "Experience with database systems (PostgreSQL, Prisma or Drizzle ORM).",
      "Familiarity with Tailwind CSS, Git, and deployment on Vercel, AWS, or GCP.",
      "Excellent problem-solving skills and communication in collaborative teams."
    ],
    benefits: [
      "Competitive salary with performance bonuses.",
      "Premium health insurance (including dental and optical).",
      "Flexible hybrid working hours and dedicated home-office stipend.",
      "Continuous learning budget (courses, certifications, books).",
      "High-end developer hardware (MacBook Pro/ThinkPad, external monitor)."
    ]
  },
  {
    id: "uiux-designer",
    title: "UI/UX & Branding Designer",
    category: "Design",
    location: "Nairobi, Kenya (Hybrid - 2 days office, 3 days remote)",
    type: "Full-time",
    salary: "Competitive, based on experience",
    description: "We are looking for a creative UI/UX & Branding Designer who can craft state-of-the-art visual interfaces, user journeys, and brand identity systems that feel premium and modern.",
    responsibilities: [
      "Create wireframes, high-fidelity UI mockups, and interactive prototypes in Figma.",
      "Develop cohesive brand guidelines (logos, color systems, typography, visual voice).",
      "Conduct user research, mapping user flows, and optimizing user experiences.",
      "Collaborate with development teams to ensure pixel-perfect implementation of designs.",
      "Present design concepts and rationales to client stakeholders."
    ],
    requirements: [
      "3+ years of UI/UX design experience with a strong portfolio showing web/mobile projects.",
      "Expert skills in Figma, Adobe Creative Suite (Illustrator, Photoshop).",
      "Solid understanding of typography, spacing, layouts, and accessibility guidelines (WCAG).",
      "Experience creating responsive layouts and design systems.",
      "Familiarity with basic HTML/CSS or how developers construct components is a plus."
    ],
    benefits: [
      "Competitive salary with annual reviews.",
      "Comprehensive medical cover.",
      "Flexible hybrid hours.",
      "High-performance design workstation (MacBook Pro, creative tools access).",
      "Design workshops, conferences, and training support."
    ]
  },
  {
    id: "security-sysadmin",
    title: "Cybersecurity & Systems Engineer",
    category: "Systems",
    location: "Nairobi, Kenya (On-site / Hybrid)",
    type: "Full-time",
    salary: "Competitive, based on experience",
    description: "We are looking for a Systems Engineer specializing in Cybersecurity to conduct audits, manage cloud/on-premise infrastructure, secure networks, and help clients align with security compliance frameworks.",
    responsibilities: [
      "Perform vulnerability assessments, penetration testing, and security compliance audits for clients.",
      "Design and maintain secure cloud infrastructure on AWS, Azure, and Google Cloud Platform.",
      "Set up, monitor, and troubleshoot firewalls, VPNs, IDS/IPS systems, and identity management protocols.",
      "Respond to security incidents, investigate breaches, and implement hardening guidelines.",
      "Draft security policy documentation, disaster recovery plans, and conduct staff training."
    ],
    requirements: [
      "3+ years of experience in systems engineering, network administration, or cybersecurity.",
      "Strong understanding of TCP/IP networking, Linux administration, and active directory systems.",
      "Hands-on experience with cloud providers (AWS, Azure) and infrastructure-as-code (Terraform).",
      "Relevant certifications are a plus (e.g., CompTIA Security+, CEH, CISSP, AWS Security, CCNA).",
      "Detail-oriented with strong analytical capabilities and communication skills."
    ],
    benefits: [
      "Competitive salary and certification bonuses.",
      "Medical cover and pension plan contributions.",
      "Training sponsorship for cybersecurity certifications.",
      "Access to premium testing/labs environments.",
      "Flexible working schedule and team hangouts."
    ]
  }
];
