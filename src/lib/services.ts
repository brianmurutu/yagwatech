export type Service = {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  metaDescription: string;
  heroIntro: string;
  overview: string;
  features: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "software-systems-development",
    name: "Software and Systems Development",
    shortName: "Software Development",
    icon: "code",
    tagline: "Custom software built around how your business actually runs",
    metaDescription:
      "Custom software and systems development services in Kenya. We design, build, and maintain web apps, internal tools, and platforms tailored to your business goals.",
    heroIntro:
      "We design and build software that fits the way your team already works, not the other way round. From internal tools to full platforms, every system we ship is built to scale with you.",
    overview:
      "Most off the shelf software forces a business to bend its processes to fit the tool. We take the opposite approach. Our development team starts by mapping how your business actually operates, then builds software around that reality. The result is systems your staff adopt quickly because the software speaks their language, not the other way round. We work across web applications, internal management tools, customer portals, and full platform builds, using modern frameworks that keep your codebase maintainable long after launch.",
    features: [
      {
        title: "Custom web applications",
        description:
          "Bespoke applications built with modern frameworks such as React, Next.js, and Laravel, designed for your exact workflow rather than a generic template.",
      },
      {
        title: "Internal business tools",
        description:
          "Dashboards, inventory systems, staff portals, and approval workflows that replace spreadsheets and manual processes with something your team can trust.",
      },
      {
        title: "API first architecture",
        description:
          "Every system we build exposes clean APIs from day one, so future integrations with payment gateways, mobile apps, or partner systems are straightforward.",
      },
      {
        title: "Legacy system modernization",
        description:
          "We assess ageing systems, identify what is worth keeping, and rebuild the rest with current frameworks, security patches, and a maintainable codebase.",
      },
    ],
    process: [
      { step: "1", title: "Discovery", description: "We sit with your team to map workflows, pain points, and the outcome you actually need." },
      { step: "2", title: "Architecture", description: "We design the data model, choose the stack, and plan how the system will scale before writing a line of code." },
      { step: "3", title: "Build", description: "Development happens in short cycles with regular check ins, so you see progress rather than waiting months for a reveal." },
      { step: "4", title: "Launch and support", description: "We deploy, train your team, and stay on for ongoing maintenance and improvements." },
    ],
    benefits: [
      "Software shaped around your real workflow, not a generic template",
      "Clean, documented code your future team can maintain",
      "Built for growth from day one, not a redo in two years",
      "Direct access to the engineers building your system",
    ],
    faqs: [
      {
        question: "How long does a typical custom software project take?",
        answer:
          "A focused internal tool can ship in four to six weeks. A full platform with multiple user roles and integrations typically takes ten to sixteen weeks, depending on scope.",
      },
      {
        question: "Do you provide the source code and documentation?",
        answer:
          "Yes. You own the codebase outright, and we hand over documentation covering architecture, setup, and how to extend the system.",
      },
      {
        question: "Can you work with our existing systems?",
        answer:
          "Yes. We regularly build software that integrates with existing databases, accounting systems, and third party tools rather than replacing everything at once.",
      },
    ],
    relatedSlugs: ["api-development-systems-integration", "cloud-services-infrastructure", "automation-workflow-engineering"],
  },
  {
    slug: "cloud-services-infrastructure",
    name: "Cloud Services and Infrastructure",
    shortName: "Cloud Infrastructure",
    icon: "cloud",
    tagline: "Cloud environments that stay fast, secure, and within budget",
    metaDescription:
      "Cloud migration, management, and infrastructure optimization services in Kenya. We help businesses move to the cloud and keep it running reliably and affordably.",
    heroIntro:
      "We help businesses migrate to the cloud, then keep that environment running reliably without the surprise bills. From first migration to ongoing optimization, we manage infrastructure so your team can focus on the business.",
    overview:
      "Moving to the cloud is often treated as a one time project, but the real value comes from how well that environment is managed afterward. We handle both sides. On the migration side, we plan and execute moves from on premise servers or other providers with minimal downtime. On the management side, we monitor performance, control costs, and tune infrastructure as your usage grows, so you are never paying for capacity you do not need or running short when demand spikes.",
    features: [
      {
        title: "Cloud migration planning and execution",
        description:
          "We assess your current infrastructure, plan a migration path with minimal disruption, and execute the move with rollback plans in place.",
      },
      {
        title: "Infrastructure as code",
        description:
          "Environments defined in code rather than manual configuration, so your infrastructure is repeatable, auditable, and easy to rebuild if needed.",
      },
      {
        title: "Cost optimization",
        description:
          "Regular reviews of your cloud spend to right size resources, eliminate waste, and forecast costs as your business scales.",
      },
      {
        title: "Monitoring and uptime management",
        description:
          "Proactive monitoring that catches performance issues before your customers notice them, with alerting that reaches your team immediately.",
      },
    ],
    process: [
      { step: "1", title: "Assessment", description: "We audit your current setup, usage patterns, and growth plans to design the right cloud architecture." },
      { step: "2", title: "Migration plan", description: "A detailed plan covering sequencing, downtime windows, and rollback options before any move happens." },
      { step: "3", title: "Migration and testing", description: "We execute the move in stages, testing thoroughly at each point to confirm everything works as expected." },
      { step: "4", title: "Ongoing management", description: "Continuous monitoring, cost reviews, and tuning so your infrastructure keeps pace with your business." },
    ],
    benefits: [
      "Lower infrastructure costs through right sized resources",
      "Reduced downtime with proactive monitoring",
      "Infrastructure that scales automatically with demand",
      "A team that understands both the technical and cost side of cloud",
    ],
    faqs: [
      {
        question: "Which cloud providers do you work with?",
        answer:
          "We work with AWS, Google Cloud, and Microsoft Azure, and we recommend the provider that best fits your budget, region, and technical needs rather than pushing one option.",
      },
      {
        question: "Will migrating to the cloud cause downtime?",
        answer:
          "We plan migrations to minimize downtime, often executing the cutover during low traffic windows, and we always have a rollback plan in place.",
      },
      {
        question: "Can you manage our cloud environment without a full migration?",
        answer:
          "Yes. Many clients already have cloud infrastructure and simply need ongoing management, cost control, and performance tuning, which we provide as a standalone service.",
      },
    ],
    relatedSlugs: ["cybersecurity-compliance", "technical-support-maintenance", "software-systems-development"],
  },
  {
    slug: "cybersecurity-compliance",
    name: "Cybersecurity and Compliance",
    shortName: "Cybersecurity",
    icon: "shield-lock",
    tagline: "Protecting your business before an incident forces the conversation",
    metaDescription:
      "Cybersecurity audits, compliance frameworks, and ongoing security monitoring for businesses in Kenya. Identify vulnerabilities before they become incidents.",
    heroIntro:
      "Most businesses discover their security gaps after an incident. We find them first. Our cybersecurity team audits your systems, closes the gaps, and puts monitoring in place so small issues never become expensive ones.",
    overview:
      "Security is rarely top of mind until something goes wrong, and by then the cost is far higher than prevention would have been. We run thorough audits across your networks, applications, and data handling practices to find what is exposed. From there we close the gaps, set up monitoring that flags unusual activity early, and help you meet the compliance frameworks relevant to your industry, whether that is data protection law or sector specific standards.",
    features: [
      {
        title: "Security audits and penetration testing",
        description:
          "Thorough testing of your networks, applications, and access controls to identify real vulnerabilities before someone else finds them.",
      },
      {
        title: "Compliance framework implementation",
        description:
          "Guidance and implementation support for data protection regulations and industry specific compliance requirements.",
      },
      {
        title: "Ongoing security monitoring",
        description:
          "Continuous monitoring for suspicious activity, with alerts and incident response plans ready before they are needed.",
      },
      {
        title: "Staff security training",
        description:
          "Practical training that helps your team recognize phishing attempts and follow secure practices, since most breaches start with human error.",
      },
    ],
    process: [
      { step: "1", title: "Audit", description: "A full review of your systems, networks, and processes to map every point of exposure." },
      { step: "2", title: "Remediation", description: "We fix the vulnerabilities found, prioritized by the risk each one poses to your business." },
      { step: "3", title: "Framework alignment", description: "We help align your practices with the compliance standards relevant to your sector." },
      { step: "4", title: "Monitoring and training", description: "Ongoing monitoring plus training so your team becomes part of your security posture, not a weak point in it." },
    ],
    benefits: [
      "Vulnerabilities found and fixed before they are exploited",
      "Clear compliance posture for regulators and clients",
      "A trained team that recognizes threats early",
      "Peace of mind backed by a documented security process",
    ],
    faqs: [
      {
        question: "How often should a business run a security audit?",
        answer:
          "We recommend a full audit at least once a year, with lighter reviews after any major system change, new integration, or staff turnover in technical roles.",
      },
      {
        question: "Do you help with data protection compliance in Kenya?",
        answer:
          "Yes. We help businesses align their data handling practices with the Kenya Data Protection Act and other relevant regulatory requirements.",
      },
      {
        question: "What happens if you find a vulnerability during an audit?",
        answer:
          "We document it clearly, explain the risk in plain terms, and prioritize fixes based on severity, starting with anything that poses an immediate threat.",
      },
    ],
    relatedSlugs: ["cloud-services-infrastructure", "business-it-consulting", "technical-support-maintenance"],
  },
  {
    slug: "uiux-design-digital-branding",
    name: "UI/UX Design and Digital Branding",
    shortName: "UI/UX and Branding",
    icon: "palette",
    tagline: "Interfaces and brand identities people actually remember",
    metaDescription:
      "UI/UX design and digital branding services in Kenya. We design intuitive interfaces and build brand identities that resonate with your audience.",
    heroIntro:
      "Good design is the difference between a customer staying or leaving in the first ten seconds. We design interfaces that feel obvious to use, and brand identities that hold together across every touchpoint.",
    overview:
      "Design is not decoration, it is how people decide whether to trust you. We approach UI/UX work by understanding the actual people using a product, then designing flows that remove friction at every step. On the branding side, we build identities, not just logos, covering color, typography, voice, and the small details that make a brand feel consistent whether someone meets you on a website, a printed flyer, or a social media post.",
    features: [
      {
        title: "User interface design",
        description:
          "Interfaces designed around real user behaviour, tested for clarity, and built to convert visitors into customers.",
      },
      {
        title: "User experience research and flows",
        description:
          "Mapping the actual journey a user takes, then removing the friction points that cause drop off.",
      },
      {
        title: "Brand identity systems",
        description:
          "Logo, color palette, typography, and voice guidelines built as a cohesive system, not a one off design.",
      },
      {
        title: "Design systems for product teams",
        description:
          "Reusable component libraries that keep your product consistent as new features and pages get added over time.",
      },
    ],
    process: [
      { step: "1", title: "Research", description: "We study your audience, competitors, and existing brand assets before any visual work starts." },
      { step: "2", title: "Concept", description: "We present design directions grounded in that research, not generic templates." },
      { step: "3", title: "Design", description: "Full interface or brand designs are built out, refined with your feedback at each stage." },
      { step: "4", title: "Handoff", description: "Developer ready files, brand guidelines, and assets delivered in a format your team can use immediately." },
    ],
    benefits: [
      "Interfaces that reduce drop off and support conversions",
      "A brand identity that holds together across every channel",
      "Design decisions backed by research, not guesswork",
      "Assets and guidelines your team can apply consistently",
    ],
    faqs: [
      {
        question: "Do you design both the brand and the product interface?",
        answer:
          "Yes, and we recommend doing both together when possible, since a strong brand identity should carry through directly into how the product looks and feels.",
      },
      {
        question: "What do we receive at the end of a branding project?",
        answer:
          "A full brand guideline covering logo usage, color codes, typography, voice, and example applications, along with editable source files.",
      },
      {
        question: "Can you redesign an existing product without starting from scratch?",
        answer:
          "Yes. Many of our UI/UX projects are redesigns of existing products, where we improve specific flows or the overall visual system without a full rebuild.",
      },
    ],
    relatedSlugs: ["digital-marketing-seo", "software-systems-development", "e-commerce-cms-solutions"],
  },
  {
    slug: "digital-marketing-seo",
    name: "Digital Marketing and SEO",
    shortName: "Digital Marketing and SEO",
    icon: "chart-arrows",
    tagline: "Traffic and visibility built on strategy, not guesswork",
    metaDescription:
      "Digital marketing and SEO services in Kenya. We drive traffic, build authority, and convert leads through strategic, measurable campaigns.",
    heroIntro:
      "Marketing without measurement is just spending. We build SEO and digital marketing campaigns around clear goals, then track what actually moves the needle so your budget goes toward what works.",
    overview:
      "Search engine optimization and digital marketing only work when they are tied to a business outcome, whether that is leads, sales, or brand visibility. We start every engagement by defining what success looks like, then build a strategy around technical SEO, content, and paid channels where appropriate. Reporting is straightforward and tied back to that original goal, so you always know what your marketing spend is producing.",
    features: [
      {
        title: "Technical SEO audits and fixes",
        description:
          "Site speed, indexing, structured data, and on page optimization handled so search engines can find and rank your content properly.",
      },
      {
        title: "Content strategy",
        description:
          "Content built around what your audience is actually searching for, rather than generic posts that do not move rankings.",
      },
      {
        title: "Local SEO for Kenyan businesses",
        description:
          "Optimization for local search results, Google Business Profile, and the queries that matter most to customers near you.",
      },
      {
        title: "Paid campaign management",
        description:
          "Search and social ad campaigns set up and managed with clear targets, so spend is tied directly to measurable results.",
      },
    ],
    process: [
      { step: "1", title: "Audit", description: "We assess your current site, rankings, and competitors to find the highest impact opportunities." },
      { step: "2", title: "Strategy", description: "A plan covering technical fixes, content priorities, and channel mix based on your specific goals." },
      { step: "3", title: "Execution", description: "We implement the technical changes and content calendar, adjusting based on early results." },
      { step: "4", title: "Reporting and refinement", description: "Regular reports tied to your actual business goals, with ongoing refinement as data comes in." },
    ],
    benefits: [
      "Clear reporting tied to business outcomes, not vanity metrics",
      "Technical SEO fixes that compound in value over time",
      "Content built around real search demand",
      "A strategy that adjusts as results come in, not a fixed plan",
    ],
    faqs: [
      {
        question: "How long does SEO take to show results?",
        answer:
          "Technical fixes can show movement within a few weeks. Meaningful ranking improvements for competitive terms typically take three to six months of consistent work.",
      },
      {
        question: "Do you handle paid advertising as well as SEO?",
        answer:
          "Yes. We manage search and social ad campaigns alongside SEO, which is often the fastest way to generate traffic while organic rankings build up.",
      },
      {
        question: "How do you report on progress?",
        answer:
          "We provide regular reports covering rankings, traffic, and conversions, framed around the specific goal we agreed on at the start of the engagement.",
      },
    ],
    relatedSlugs: ["uiux-design-digital-branding", "data-analytics-business-intelligence", "e-commerce-cms-solutions"],
  },
  {
    slug: "training-capacity-building",
    name: "Training and Capacity Building",
    shortName: "Training",
    icon: "school",
    tagline: "Equipping your team, not just installing the software",
    metaDescription:
      "IT training, digital literacy workshops, and capacity building programs for teams and organizations in Kenya.",
    heroIntro:
      "Software is only as useful as the people who can operate it. We run training programs and workshops that get your team genuinely comfortable with new tools and digital ways of working.",
    overview:
      "A new system rolled out without proper training quietly fails within months, no matter how well it was built. We design training programs around the actual skill level of your team, covering everything from basic digital literacy to advanced tool specific workshops. Sessions are practical and hands on, built around real tasks your team will perform, not abstract theory.",
    features: [
      {
        title: "Digital literacy workshops",
        description:
          "Foundational training for teams new to digital tools, covering the practical skills needed to work confidently online.",
      },
      {
        title: "Tool specific training",
        description:
          "Hands on sessions for the exact software your team uses, whether that is a system we built or an existing platform.",
      },
      {
        title: "Corporate onboarding systems",
        description:
          "Structured onboarding programs that get new hires productive faster, with materials your team can reuse.",
      },
      {
        title: "Community capacity building programs",
        description:
          "Workshops designed for community organizations and groups, focused on practical digital skills that open new opportunities.",
      },
    ],
    process: [
      { step: "1", title: "Needs assessment", description: "We assess the current skill level and specific gaps within your team or community group." },
      { step: "2", title: "Curriculum design", description: "Training content built around real tasks and tools relevant to the participants." },
      { step: "3", title: "Delivery", description: "Hands on sessions delivered in person or remotely, with practical exercises throughout." },
      { step: "4", title: "Follow up support", description: "Materials and a support window after training so questions that come up later still get answered." },
    ],
    benefits: [
      "Higher adoption rates for new systems and tools",
      "Training built around real tasks, not generic theory",
      "Reusable materials your team can refer back to",
      "Programs that scale from a small team to a full organization",
    ],
    faqs: [
      {
        question: "Can training be delivered remotely?",
        answer:
          "Yes. We deliver training both in person and remotely, depending on team location and preference, with the same hands on approach either way.",
      },
      {
        question: "Do you offer training for community organizations, not just companies?",
        answer:
          "Yes. We run digital literacy and capacity building workshops for community groups and initiatives, including programs focused on broader digital empowerment.",
      },
      {
        question: "What happens after the training session ends?",
        answer:
          "We provide reference materials and a follow up support window so participants can ask questions as they start applying what they learned.",
      },
    ],
    relatedSlugs: ["business-it-consulting", "technical-support-maintenance", "software-systems-development"],
  },
  {
    slug: "business-it-consulting",
    name: "Business and IT Consulting",
    shortName: "IT Consulting",
    icon: "briefcase",
    tagline: "Technology decisions aligned to where your business is actually headed",
    metaDescription:
      "Business and IT consulting services in Kenya. We align technology decisions with business strategy to drive measurable transformation.",
    heroIntro:
      "Technology choices made in isolation from business strategy tend to age badly. We work with leadership teams to align IT decisions with where the business is actually headed, not just what is trending.",
    overview:
      "Many technology investments fail not because the tool was wrong, but because it was never tied to a clear business objective. Our consulting work starts at that strategic level, understanding your growth plans, constraints, and competitive position, before recommending specific technology or process changes. We act as an extension of your leadership team for the duration of the engagement, translating business goals into a realistic technology roadmap.",
    features: [
      {
        title: "Technology strategy and roadmapping",
        description:
          "A clear, prioritized roadmap connecting your business goals to specific technology investments over the next twelve to twenty four months.",
      },
      {
        title: "Digital transformation advisory",
        description:
          "Guidance through the practical steps of digitizing processes, without disrupting operations more than necessary.",
      },
      {
        title: "Vendor and tool selection",
        description:
          "Objective evaluation of software vendors and tools, so decisions are based on fit rather than sales pitches.",
      },
      {
        title: "IT governance and process design",
        description:
          "Frameworks for how technology decisions get made, reviewed, and budgeted within your organization going forward.",
      },
    ],
    process: [
      { step: "1", title: "Discovery", description: "We learn your business model, goals, and current technology landscape in depth." },
      { step: "2", title: "Assessment", description: "We identify gaps between where you are and where your strategy requires you to be." },
      { step: "3", title: "Roadmap", description: "A prioritized, realistic plan for the technology and process changes needed." },
      { step: "4", title: "Execution support", description: "We stay engaged through implementation, adjusting the plan as real world results come in." },
    ],
    benefits: [
      "Technology decisions tied directly to business outcomes",
      "Objective vendor recommendations, free of sales bias",
      "A realistic roadmap instead of an overwhelming wish list",
      "An experienced team acting as an extension of leadership",
    ],
    faqs: [
      {
        question: "Is this consulting service only for large enterprises?",
        answer:
          "No. We work with startups and SMEs just as often as larger organizations, scaling the engagement to match the size and complexity of the business.",
      },
      {
        question: "Do you implement the recommendations yourselves?",
        answer:
          "We can, through our other service lines such as development, cloud, or training, or we can hand the roadmap to your existing team to execute.",
      },
      {
        question: "How long does a typical consulting engagement run?",
        answer:
          "Initial strategy work often takes four to six weeks, with many clients continuing on a retainer basis for ongoing advisory support.",
      },
    ],
    relatedSlugs: ["data-analytics-business-intelligence", "training-capacity-building", "cybersecurity-compliance"],
  },
  {
    slug: "e-commerce-cms-solutions",
    name: "E-Commerce and CMS Solutions",
    shortName: "E-Commerce and CMS",
    icon: "shopping-cart",
    tagline: "Online stores and content platforms your team can manage without a developer",
    metaDescription:
      "E-commerce and content management system development in Kenya. We build online stores and content platforms that are easy to manage and scale.",
    heroIntro:
      "An online store should not require a developer every time you add a product. We build e-commerce platforms and content management systems that your team can run independently, with the technical heavy lifting handled upfront.",
    overview:
      "Whether you need a full online store with payment processing, or a content platform for managing articles, pages, and media, the priority is the same, your team should be able to manage day to day content without writing code. We build on proven platforms where it makes sense, or custom systems when off the shelf options fall short, always with M-Pesa and other locally relevant payment integrations available where needed.",
    features: [
      {
        title: "Online store development",
        description:
          "Full e-commerce builds with product catalogues, cart, checkout, and payment integration including M-Pesa and card processing.",
      },
      {
        title: "Custom content management systems",
        description:
          "Admin dashboards that let non technical staff manage pages, articles, and media without touching code.",
      },
      {
        title: "Platform migrations",
        description:
          "Moving an existing store or content site to a new platform without losing products, content, SEO rankings, or order history.",
      },
      {
        title: "Inventory and order management",
        description:
          "Systems that track stock levels and orders accurately, reducing the manual reconciliation that eats up staff time.",
      },
    ],
    process: [
      { step: "1", title: "Planning", description: "We map the product catalogue, content structure, and who on your team will manage what." },
      { step: "2", title: "Build", description: "The store or CMS is built with the admin experience treated as seriously as the public facing site." },
      { step: "3", title: "Payment and integrations", description: "Payment gateways and any third party integrations are connected and tested thoroughly." },
      { step: "4", title: "Training and launch", description: "We train your team on the admin dashboard before launch, so day one runs smoothly." },
    ],
    benefits: [
      "An admin experience your team can actually use without help",
      "Local payment options including M-Pesa built in",
      "Clean data migration with no lost content or SEO equity",
      "A platform that scales as your catalogue grows",
    ],
    faqs: [
      {
        question: "Can you integrate M-Pesa into our online store?",
        answer:
          "Yes. M-Pesa integration through the Daraja API is one of our most common requests, and we build it as a standard part of e-commerce projects for the Kenyan market.",
      },
      {
        question: "Do you build on existing platforms or always from scratch?",
        answer:
          "We assess your specific needs first. Sometimes a platform like WordPress or Shopify is the right fit, other times a custom build serves you better long term. We recommend honestly rather than defaulting to one option.",
      },
      {
        question: "Can our existing content be migrated without losing search rankings?",
        answer:
          "Yes. We handle migrations with proper URL redirects and metadata preservation specifically to protect the SEO equity you have already built.",
      },
    ],
    relatedSlugs: ["digital-marketing-seo", "uiux-design-digital-branding", "api-development-systems-integration"],
  },
  {
    slug: "api-development-systems-integration",
    name: "API Development and Systems Integration",
    shortName: "API and Integrations",
    icon: "plug-connected",
    tagline: "Connecting the tools you already use instead of replacing them",
    metaDescription:
      "API development and systems integration services in Kenya. We connect platforms and automate workflows through secure, scalable APIs.",
    heroIntro:
      "Most businesses do not need to replace their existing tools, they need those tools talking to each other properly. We build APIs and integrations that connect your systems so data moves automatically instead of being copied by hand.",
    overview:
      "When systems do not talk to each other, someone on your team ends up manually copying data between them, which is slow and error prone. We build secure, well documented APIs and integrations that connect your CRM, accounting software, e-commerce platform, and any other tools in your stack, so information flows automatically and stays consistent everywhere it needs to appear.",
    features: [
      {
        title: "Custom API development",
        description:
          "Secure, documented APIs built to expose exactly the data and functionality your integrations need, nothing more.",
      },
      {
        title: "Third party integrations",
        description:
          "Connections between your systems and external services such as payment gateways, SMS providers, and accounting platforms.",
      },
      {
        title: "Workflow automation between systems",
        description:
          "Automated data flow between tools that previously required manual entry, reducing errors and saving staff time.",
      },
      {
        title: "API security and rate limiting",
        description:
          "Authentication, authorization, and rate limiting built in from the start so your APIs are not a security liability.",
      },
    ],
    process: [
      { step: "1", title: "Mapping", description: "We identify every system involved and exactly what data needs to move between them." },
      { step: "2", title: "Design", description: "API contracts and integration logic are designed and documented before building begins." },
      { step: "3", title: "Build and test", description: "Integrations are built and tested thoroughly against real data scenarios, not just happy paths." },
      { step: "4", title: "Monitor and maintain", description: "We monitor integrations after launch and adjust as the connected systems change over time." },
    ],
    benefits: [
      "Less manual data entry across your team",
      "Fewer errors from copying information between systems",
      "Secure, documented APIs that are easy to extend later",
      "Integrations that keep working as connected systems update",
    ],
    faqs: [
      {
        question: "Can you integrate with software we did not build ourselves?",
        answer:
          "Yes. Most of our integration work connects to third party platforms we did not build, as long as they expose an API or a reasonable way to access data.",
      },
      {
        question: "What happens if a connected system changes its API?",
        answer:
          "We monitor integrations and update them when a connected service changes its API, which is part of our ongoing maintenance offering.",
      },
      {
        question: "Do you document the APIs you build for us?",
        answer:
          "Yes, every API we build comes with clear documentation covering endpoints, authentication, and example requests for your team or future developers.",
      },
    ],
    relatedSlugs: ["software-systems-development", "automation-workflow-engineering", "data-analytics-business-intelligence"],
  },
  {
    slug: "data-analytics-business-intelligence",
    name: "Data Analytics and Business Intelligence",
    shortName: "Data Analytics",
    icon: "chart-bar",
    tagline: "Turning the data you already have into decisions you can act on",
    metaDescription:
      "Data analytics and business intelligence services in Kenya. We turn raw data into actionable insights that drive smarter decisions.",
    heroIntro:
      "Most businesses are sitting on more data than they realize, scattered across spreadsheets, systems, and reports nobody reads. We turn that raw data into dashboards and insights your team can actually use to make decisions.",
    overview:
      "Data only has value once someone can act on it. We start by understanding the decisions your business actually needs to make, then build dashboards and reporting that surface exactly the information needed for those decisions, pulled from wherever your data currently lives. The goal is always a smaller number of clear, trusted metrics rather than an overwhelming dashboard nobody opens twice.",
    features: [
      {
        title: "Business intelligence dashboards",
        description:
          "Visual dashboards that surface the metrics that matter to your business, updated automatically as new data comes in.",
      },
      {
        title: "Data pipeline setup",
        description:
          "Automated pipelines that pull data from multiple sources into one place, removing the need for manual exports and spreadsheets.",
      },
      {
        title: "Custom reporting",
        description:
          "Reports built around the specific questions your leadership team asks regularly, delivered in the format they actually use.",
      },
      {
        title: "Data driven decision frameworks",
        description:
          "Helping teams build the habit of checking data before making decisions, not just installing a tool and hoping it gets used.",
      },
    ],
    process: [
      { step: "1", title: "Define questions", description: "We start with the actual business decisions data should be informing, not just available data sources." },
      { step: "2", title: "Connect sources", description: "We connect and clean data from wherever it currently lives, building automated pipelines where needed." },
      { step: "3", title: "Build dashboards", description: "Dashboards and reports are built around the defined questions, kept focused rather than overloaded." },
      { step: "4", title: "Train and refine", description: "We train your team to read and trust the dashboards, refining based on what actually gets used." },
    ],
    benefits: [
      "Decisions backed by real data instead of gut feeling alone",
      "Less time spent manually compiling reports each month",
      "Dashboards built around questions your team actually asks",
      "A foundation that scales as more data sources get added",
    ],
    faqs: [
      {
        question: "Our data is spread across multiple spreadsheets, can you still help?",
        answer:
          "Yes. Scattered spreadsheet data is one of the most common starting points we work with, and consolidating it into a single reliable source is often the first phase of the project.",
      },
      {
        question: "Do you build custom dashboards or use existing tools?",
        answer:
          "We typically use established business intelligence tools for the dashboard layer, since they are reliable and your team can learn them quickly, while we handle the data pipeline and setup work behind them.",
      },
      {
        question: "How do you decide which metrics to include?",
        answer:
          "We start by asking what decisions the dashboard needs to support, then work backward to the smallest set of metrics that genuinely informs those decisions.",
      },
    ],
    relatedSlugs: ["business-it-consulting", "api-development-systems-integration", "digital-marketing-seo"],
  },
  {
    slug: "technical-support-maintenance",
    name: "Technical Support and Maintenance",
    shortName: "Technical Support",
    icon: "headset",
    tagline: "Systems that keep running quietly, the way they should",
    metaDescription:
      "Technical support and IT maintenance services in Kenya. Proactive support and performance optimization that keeps your systems running smoothly.",
    heroIntro:
      "The best technical support is the kind you barely notice, because issues get caught before they become outages. We provide ongoing support and maintenance that keeps your systems and software running smoothly.",
    overview:
      "Software and infrastructure degrade quietly if nobody is watching, whether through accumulating bugs, outdated dependencies, or creeping performance issues. We provide ongoing technical support that catches these problems early, alongside responsive help when something does break. Support plans are scoped to match your actual usage, from a few hours a month for a small site to dedicated coverage for a larger platform.",
    features: [
      {
        title: "Proactive system monitoring",
        description:
          "Continuous monitoring that flags performance issues, errors, and unusual activity before they affect your users.",
      },
      {
        title: "Bug fixes and patching",
        description:
          "Regular updates and bug fixes that keep software secure and stable, rather than letting issues accumulate.",
      },
      {
        title: "Responsive help desk support",
        description:
          "A clear channel for your team to report issues and get timely responses, with defined response times based on severity.",
      },
      {
        title: "Performance optimization",
        description:
          "Periodic reviews that identify and fix performance bottlenecks before they become noticeable to your users.",
      },
    ],
    process: [
      { step: "1", title: "Onboarding", description: "We review your systems and document baseline performance and known issues before support begins." },
      { step: "2", title: "Monitoring setup", description: "Monitoring and alerting are configured so issues are caught automatically, not reported by frustrated users." },
      { step: "3", title: "Ongoing support", description: "Regular maintenance plus responsive support for issues as they arise, tracked against agreed response times." },
      { step: "4", title: "Review", description: "Periodic reviews of system health and recurring issues, with recommendations for longer term fixes." },
    ],
    benefits: [
      "Issues caught before they become outages",
      "A clear, responsive channel when something does go wrong",
      "Systems that stay current with security patches",
      "Support scoped to match your actual usage and budget",
    ],
    faqs: [
      {
        question: "Do you only support systems you originally built?",
        answer:
          "No. We take on support contracts for systems built by other teams as well, after an initial review to understand the existing codebase and infrastructure.",
      },
      {
        question: "What are your typical response times?",
        answer:
          "Response times depend on the support plan and issue severity, with critical issues typically addressed within hours and minor requests within one to two business days.",
      },
      {
        question: "Can support plans scale up if our needs grow?",
        answer:
          "Yes. Support plans are reviewed regularly and can be adjusted as your systems, traffic, or team size changes.",
      },
    ],
    relatedSlugs: ["cloud-services-infrastructure", "cybersecurity-compliance", "software-systems-development"],
  },
  {
    slug: "automation-workflow-engineering",
    name: "Automation and Workflow Engineering",
    shortName: "Automation",
    icon: "robot",
    tagline: "Removing the repetitive work that quietly eats your week",
    metaDescription:
      "Business process automation and workflow engineering services in Kenya. We streamline operations by automating repetitive tasks.",
    heroIntro:
      "Every business has tasks that get done the same way, every single time, by a person who could be doing something more valuable. We find those tasks and automate them, freeing your team to focus on work that actually needs judgment.",
    overview:
      "Repetitive manual work is one of the most common sources of wasted time and small errors inside growing businesses. We map your existing workflows, identify the steps that follow a predictable pattern, and build automation that handles them reliably, whether that is data entry between systems, scheduled reports, approval routing, or notification handling. The goal is always time given back to your team, with a clear record of what is now running automatically.",
    features: [
      {
        title: "Workflow mapping and analysis",
        description:
          "A clear map of your current processes that identifies exactly which steps are good candidates for automation.",
      },
      {
        title: "Process automation builds",
        description:
          "Automated workflows that handle repetitive tasks reliably, from data entry to approval routing and scheduled actions.",
      },
      {
        title: "Notification and alerting systems",
        description:
          "Automated alerts that reach the right person at the right time, replacing manual checking and follow up.",
      },
      {
        title: "Integration with existing tools",
        description:
          "Automation built to work within your current software stack rather than requiring a separate system to manage.",
      },
    ],
    process: [
      { step: "1", title: "Map workflows", description: "We document your current processes and flag the repetitive, rule based steps worth automating." },
      { step: "2", title: "Prioritize", description: "We rank automation opportunities by time saved against effort required, starting with the highest impact wins." },
      { step: "3", title: "Build", description: "Automations are built and tested against real scenarios, including edge cases that manual processes often miss." },
      { step: "4", title: "Monitor and adjust", description: "We monitor automated workflows after launch and adjust as your processes evolve." },
    ],
    benefits: [
      "Hours of manual work returned to your team each week",
      "Fewer errors from repetitive manual data entry",
      "Automations that fit your existing tools, not a new system to learn",
      "A clear record of what runs automatically and why",
    ],
    faqs: [
      {
        question: "What kinds of tasks are good candidates for automation?",
        answer:
          "Tasks that follow a consistent, rule based pattern are the best fit, such as data entry between systems, scheduled reports, approval routing, and repetitive notifications.",
      },
      {
        question: "Will automation replace staff roles?",
        answer:
          "Most of our automation work removes repetitive sub tasks from a role rather than the role itself, freeing staff to focus on work that requires judgment and relationships.",
      },
      {
        question: "How do you handle exceptions that do not fit the normal pattern?",
        answer:
          "We design automations to flag exceptions for human review rather than forcing every case through the same path, which keeps the system reliable.",
      },
    ],
    relatedSlugs: ["api-development-systems-integration", "software-systems-development", "data-analytics-business-intelligence"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(service: Service) {
  return service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean) as Service[];
}
