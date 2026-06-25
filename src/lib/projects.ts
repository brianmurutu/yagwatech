export type Project = {
  slug: string;
  title: string;
  categories: string[];
  client: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  services: string[];
};

export const projects: Project[] = [
  {
    slug: "rusinga-digital-empowerment-initiative",
    title: "Rusinga Digital Empowerment Initiative (RDEI)",
    categories: ["Community Empowerment"],
    client: "RDEI",
    year: "2025",
    summary:
      "A community digital literacy program for Rusinga Island, designed to bring practical digital skills to residents with limited prior exposure to computers and the internet.",
    challenge:
      "Most residents of Rusinga Island had little to no prior exposure to computers or the internet, and existing training material was not adapted to the local context or pace of learning needed.",
    solution:
      "We designed a step by step digital literacy curriculum delivered through in person workshops, supported by simple printed reference material residents could keep and revisit after each session.",
    results: [
      "Hundreds of residents trained across multiple workshop cohorts",
      "A reusable curriculum now applied in similar community programs",
      "Stronger digital confidence among small business owners on the island",
    ],
    services: ["Training and Capacity Building", "Business and IT Consulting"],
  },
  {
    slug: "business-matching",
    title: "Business Matching Platform",
    categories: ["Consulting", "Branding"],
    client: "Business Matching",
    year: "2024",
    summary:
      "A brand identity and consulting engagement for a platform connecting investors with growth stage businesses.",
    challenge:
      "The client needed a credible, professional brand identity and clear positioning to attract both investors and the businesses seeking funding, in a space already crowded with similar platforms.",
    solution:
      "We developed a brand identity grounded in trust and clarity, paired with consulting on positioning and messaging that distinguished the platform from generic matchmaking services.",
    results: [
      "A cohesive brand identity applied across digital and print materials",
      "Clearer positioning that resonated with both sides of the platform's audience",
      "A foundation used in subsequent investor facing materials",
    ],
    services: ["Business and IT Consulting", "UI/UX Design and Digital Branding"],
  },
  {
    slug: "assets-for-technology",
    title: "Assets For Technology",
    categories: ["Development", "Consulting"],
    client: "Assets For Technology",
    year: "2024",
    summary:
      "A development and consulting engagement helping a technology asset management firm modernize its internal systems.",
    challenge:
      "The client managed technology assets across multiple sites using disconnected spreadsheets, making it difficult to track asset status, location, and maintenance history accurately.",
    solution:
      "We built a centralized asset tracking system with role based access, paired with consulting support on the broader operational workflow around asset management.",
    results: [
      "A single source of truth for asset records across all sites",
      "Reduced time spent reconciling conflicting spreadsheet records",
      "Clearer visibility into maintenance schedules and asset lifecycle",
    ],
    services: ["Software and Systems Development", "Business and IT Consulting"],
  },
  {
    slug: "merger-acquisition",
    title: "Merger and Acquisition System",
    categories: ["Development", "Consulting"],
    client: "Confidential",
    year: "2023",
    summary:
      "A secure internal system built to support due diligence and document management during a merger and acquisition process.",
    challenge:
      "The transaction required secure handling of sensitive financial and legal documents across multiple stakeholders, with strict access control and an audit trail of who viewed what and when.",
    solution:
      "We built a secure document management and workflow system with granular permissions, audit logging, and structured review stages aligned to the transaction timeline.",
    results: [
      "Sensitive documents managed with full access control and audit history",
      "Faster review cycles through structured workflow stages",
      "A repeatable system structure for future transaction support",
    ],
    services: ["Software and Systems Development", "Cybersecurity and Compliance"],
  },
  {
    slug: "startup-funding",
    title: "Startup Funding Platform",
    categories: ["Development", "Finance"],
    client: "Confidential",
    year: "2023",
    summary:
      "A platform development project supporting a startup funding initiative, including application workflows and financial reporting.",
    challenge:
      "The client needed a structured way for startups to apply for funding, be evaluated against criteria, and for the funding body to track disbursements and reporting requirements.",
    solution:
      "We built an application and evaluation platform with structured scoring workflows, plus financial reporting features to track disbursed funds against milestones.",
    results: [
      "A streamlined application process replacing manual email based submissions",
      "Consistent evaluation criteria applied across all applicants",
      "Clear financial reporting tied to funding milestones",
    ],
    services: ["Software and Systems Development", "Data Analytics and Business Intelligence"],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const portfolioCategories = [
  "All",
  "Development",
  "Consulting",
  "Finance",
  "Branding",
  "Community Empowerment",
];
