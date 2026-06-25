export type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    category: "General",
    question: "What services does Yagwa Tech Solutions offer?",
    answer:
      "We offer twelve core service areas including software development, cloud infrastructure, cybersecurity, UI/UX design and branding, digital marketing and SEO, training, IT consulting, e-commerce and CMS solutions, API development, data analytics, technical support, and automation. Visit our services page for the full breakdown of each.",
  },
  {
    category: "General",
    question: "Where is Yagwa Tech Solutions based, and do you work outside Kenya?",
    answer:
      "We are based in Nairobi, Kenya, and serve clients across Kenya and the wider East Africa region. We also take on remote projects for clients further afield where the engagement fits our service model.",
  },
  {
    category: "General",
    question: "How do I get started on a project with your team?",
    answer:
      "The fastest way to start is by submitting a request through our get a quote page, or reaching out directly through our contact page. We typically respond within one business day to schedule an initial discovery call.",
  },
  {
    category: "Pricing",
    question: "How is pricing determined for a project?",
    answer:
      "Pricing depends on project scope, complexity, and timeline. Smaller projects such as a single landing page or a focused automation may be quoted as a fixed price, while larger platform builds are typically scoped after an initial discovery call. Visit our pricing page for indicative ranges.",
  },
  {
    category: "Pricing",
    question: "Do you require a deposit before starting work?",
    answer:
      "Yes, most engagements begin with a deposit, with the remaining balance structured around project milestones. The exact structure is agreed upon and documented before any work begins.",
  },
  {
    category: "Process",
    question: "How long does a typical project take?",
    answer:
      "Timelines vary by service and scope. A focused website or landing page can be ready in two to four weeks, while a full custom platform with multiple integrations typically takes ten to sixteen weeks. We provide a specific estimate once we understand your requirements.",
  },
  {
    category: "Process",
    question: "Will I be able to track progress during the project?",
    answer:
      "Yes. We provide regular updates throughout the engagement, with check ins scheduled at key milestones so you always know where the project stands and can give feedback early rather than at the very end.",
  },
  {
    category: "Process",
    question: "Do you provide ongoing support after a project is delivered?",
    answer:
      "Yes. We offer technical support and maintenance plans for after launch, covering monitoring, bug fixes, and performance optimization, scoped to match your actual usage.",
  },
  {
    category: "Technical",
    question: "Can you integrate M-Pesa and other local payment methods?",
    answer:
      "Yes. M-Pesa integration through the Daraja API, along with card payments and other payment rails, is a standard part of our e-commerce and software development work.",
  },
  {
    category: "Technical",
    question: "Do you work with existing systems, or only build from scratch?",
    answer:
      "We do both. Many of our engagements involve improving, integrating with, or modernizing existing systems rather than rebuilding everything from the ground up.",
  },
  {
    category: "Technical",
    question: "Who owns the code and intellectual property after the project is complete?",
    answer:
      "You own the codebase, designs, and any custom intellectual property created specifically for your project, in line with the terms agreed in our service contract.",
  },
];

export const faqCategories = ["All", "General", "Pricing", "Process", "Technical"];
