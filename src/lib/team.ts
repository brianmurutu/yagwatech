export type TeamMember = {
  name: string;
  role: string;
  email?: string;
  initials: string;
  colorFrom: string;
  colorTo: string;
  avatarUrl?: string;
  socials: { platform: string; url: string }[];
};

export const team: TeamMember[] = [
  {
    name: "Peter Yagwa",
    role: "Chief Executive Officer",
    initials: "PY",
    colorFrom: "#0B3D91",
    colorTo: "#1A56C4",
    avatarUrl: "/images/team_peter_yagwa.jpg",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/company/hi-techparks/" },
      { platform: "facebook", url: "https://www.facebook.com/HiTechParks/" },
      { platform: "instagram", url: "https://www.instagram.com/yagwatech/" },
    ],
  },
  {
    name: "Brian Murutu",
    role: "Project Manager",
    email: "projectmanager@yagwatech.com",
    initials: "BM",
    colorFrom: "#F47B20",
    colorTo: "#D96A10",
    avatarUrl: "/images/team_brian_murutu.jpg",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/sir-brian/" },
      { platform: "facebook", url: "https://www.facebook.com/sirbriandev" },
      { platform: "instagram", url: "https://www.instagram.com/sir_brian_ke" },
    ],
  },
  {
    name: "Phineas Kirimi",
    role: "Web Developer",
    email: "phineas@yagwatech.com",
    initials: "PK",
    colorFrom: "#0B3D91",
    colorTo: "#07255A",
    avatarUrl: "/images/team_phineas_kirimi.jpg",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/company/" },
      { platform: "github", url: "https://github.com/yagwatech" },
      { platform: "facebook", url: "https://www.facebook.com/yagwatech/" },
    ],
  },
  {
    name: "Christina Wilson",
    role: "SEO Specialist and Growth Hacker",
    email: "christina@yagwatech.com",
    initials: "CW",
    colorFrom: "#0F6E56",
    colorTo: "#1D9E75",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/company/hi-techparks/" },
      { platform: "facebook", url: "https://www.facebook.com/yagwatech/" },
      { platform: "instagram", url: "https://www.instagram.com/yagwatech/" },
    ],
  },
  {
    name: "Timothy Mugendi",
    role: "Chief IT Consultant",
    email: "mugendi@yagwatech.com",
    initials: "TM",
    colorFrom: "#0B3D91",
    colorTo: "#1A56C4",
    avatarUrl: "/images/team_timothy_mugendi.jpg",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/sir-brian/" },
      { platform: "facebook", url: "https://www.facebook.com/HiTechParks/" },
      { platform: "instagram", url: "https://www.instagram.com/yagwatech/" },
    ],
  },
  {
    name: "Isaac Odari",
    role: "Finance and Investments Analyst",
    initials: "IO",
    colorFrom: "#533AB7",
    colorTo: "#7F77DD",
    avatarUrl: "/images/team_isaac_odari.jpg",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/company/" },
      { platform: "facebook", url: "https://www.facebook.com/yagwatech/" },
      { platform: "instagram", url: "https://www.instagram.com/yagwatech/" },
    ],
  },
];

export type Testimonial = {
  name: string;
  role: string;
  initials: string;
  color: string;
  photo: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Samuel N.",
    role: "IT Manager, Manufacturing Firm",
    initials: "SN",
    color: "#0B3D91",
    photo: "/images/reviewer_samuel.jpg",
    quote:
      "Their cybersecurity audit revealed vulnerabilities we did not know existed. They fixed everything, trained our team, and gave us peace of mind. Highly recommend for any organization serious about data protection.",
  },
  {
    name: "David K.",
    role: "Co-Founder, Fintech Startup",
    initials: "DK",
    color: "#F47B20",
    photo: "/images/reviewer_david.jpg",
    quote:
      "We needed a custom SaaS platform built from scratch. YagwaTech delivered on time with scalability and security in mind. Their backend architecture and onboarding flows were spot on.",
  },
  {
    name: "Grace M.",
    role: "Operations Lead, East Africa NGO",
    initials: "GM",
    color: "#0F6E56",
    photo: "/images/reviewer_grace.jpg",
    quote:
      "We approached them with a broken website and no clear strategy. Within weeks they delivered a sleek, responsive platform and helped us streamline our operations. Their team is sharp, communicative, and genuinely invested in our success.",
  },
];

export const clients = ["Microsoft", "Google", "Huawei", "Verizon"];
