export type TeamMember = {
  name: string;
  role: string;
  email?: string;
  initials: string;
  colorFrom: string;
  colorTo: string;
  socials: { platform: string; url: string }[];
};

export const team: TeamMember[] = [
  {
    name: "Peter Yagwa",
    role: "Chief Executive Officer",
    initials: "PY",
    colorFrom: "#0B3D91",
    colorTo: "#1A56C4",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/company/hi-techparks/" },
      { platform: "twitter", url: "https://twitter.com/hitechparks" },
      { platform: "facebook", url: "https://www.facebook.com/HiTechParks/" },
    ],
  },
  {
    name: "Brian Murutu",
    role: "Project Manager",
    email: "projectmanager@yagwatech.com",
    initials: "BM",
    colorFrom: "#F47B20",
    colorTo: "#D96A10",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/sir-brian/" },
      { platform: "instagram", url: "https://www.instagram.com/sir_brian_ke" },
      { platform: "facebook", url: "https://www.facebook.com/sirbriandev" },
      { platform: "twitter", url: "https://www.twitter.com/sirbrianmurutu" },
    ],
  },
  {
    name: "Phineas Kirimi",
    role: "Web Developer",
    email: "phineas@yagwatech.com",
    initials: "PK",
    colorFrom: "#0B3D91",
    colorTo: "#07255A",
    socials: [{ platform: "linkedin", url: "https://www.linkedin.com/company/" }],
  },
  {
    name: "Christina Wilson",
    role: "SEO Specialist and Growth Hacker",
    email: "christina@yagwatech.com",
    initials: "CW",
    colorFrom: "#0F6E56",
    colorTo: "#1D9E75",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/company/hi-techparks/" },
      { platform: "twitter", url: "https://twitter.com/hitechparks" },
    ],
  },
  {
    name: "Timothy Mugendi",
    role: "Chief IT Consultant",
    email: "mugendi@yagwatech.com",
    initials: "TM",
    colorFrom: "#0B3D91",
    colorTo: "#1A56C4",
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/sir-brian/" },
      { platform: "facebook", url: "https://www.facebook.com/HiTechParks/" },
    ],
  },
  {
    name: "Isaac Odari",
    role: "Finance and Investments Analyst",
    initials: "IO",
    colorFrom: "#533AB7",
    colorTo: "#7F77DD",
    socials: [],
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
