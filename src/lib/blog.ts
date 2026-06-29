export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription: string;
  focusKeyword?: string;
  featuredImage?: string;
  readingMinutes?: number;
  author: string;
  content: string | string[];
  status?: 'Published' | 'Draft';
  tags?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "why-every-business-needs-cloud-migration",
    slug: "why-every-business-needs-cloud-migration",
    title: "Why every business needs cloud migration",
    category: "Cloud and Infrastructure",
    date: "2025-12-11",
    status: "Published",
    excerpt:
      "Cloud technology is no longer optional. It is the backbone of modern business infrastructure, and the businesses that delay migration are quietly falling behind on cost, reliability, and speed.",
    metaTitle: "Why Cloud Migration is Essential for Kenyan Businesses",
    metaDescription:
      "Discover why cloud migration is crucial for businesses in Kenya. Learn how moving to the cloud improves reliability, optimizes costs, and scales operations.",
    focusKeyword: "cloud migration",
    featuredImage: "/images/blog-cloud-migration.png",
    readingMinutes: 6,
    author: "Yagwa Tech Solutions",
    tags: "Cloud Computing, Infrastructure, Digital Transformation, Business Growth, Tech Strategy",
    content: [
      "Cloud technology is no longer optional. It is the backbone of modern business infrastructure, and organizations that delay migration are quietly falling behind on cost, reliability, and the ability to respond quickly to demand.",
      "For many businesses in Kenya, the hesitation around cloud migration comes from a fear of disruption. Servers that have run the same way for years feel safer than an unfamiliar environment, even when the real cost of staying put is rising every month in maintenance, hardware replacement, and missed opportunities for automatic scaling.",
      "The case for migration usually comes down to three things. First, cost predictability. Cloud infrastructure lets you pay for what you use, rather than over provisioning hardware for peak demand that only happens a few times a year. Second, reliability. Major cloud providers offer uptime guarantees and redundancy that are difficult and expensive to replicate with on-premise servers. Third, speed. Spinning up new infrastructure for a project takes minutes in the cloud, compared to weeks of procurement for physical hardware.",
      "None of this means migration should happen overnight. A well-planned move starts with an honest assessment of what you currently run, which systems are safe to move first, and which need more careful handling because of data sensitivity or legacy dependencies. We typically recommend starting with lower risk systems to build confidence and refine the process before tackling anything business critical.",
      "Cost is often the first concern raised, and it deserves a more direct answer. Cloud costs can rise unexpectedly if resources are not monitored, which is why ongoing cost management matters as much as the migration itself. A migration without a follow-up plan for monitoring and optimization tends to disappoint on the cost side within the first year.",
      "If your business is still weighing whether to move, the more useful question is not whether to migrate, but how to do it in a way that protects uptime and controls cost from day one. That planning conversation is worth having before any infrastructure actually moves.",
    ],
  },
  {
    id: "kenya-ai-readiness-ranking-what-it-means",
    slug: "kenya-ai-readiness-ranking-what-it-means",
    title: "Kenya ranks in the global top 100 for AI readiness, here is what it means",
    category: "AI and Technology",
    date: "2025-09-01",
    status: "Published",
    excerpt:
      "Kenya has been ranked among the top 100 countries globally and top 10 in Africa for government AI readiness. Here is what that ranking actually means for jobs, schools, and the economy.",
    metaTitle: "Kenya's Global AI Readiness Ranking: What It Means for You",
    metaDescription:
      "Kenya ranks in the global top 100 for AI readiness. Find out what this milestone means for businesses, jobs, education, and the digital economy.",
    focusKeyword: "AI readiness",
    featuredImage: "/images/blog-ai-readiness.png",
    readingMinutes: 5,
    author: "Yagwa Tech Solutions",
    tags: "Artificial Intelligence, Tech Policy, Kenya, Digital Economy, Innovation",
    content: [
      "Kenya has been ranked among the top 100 countries globally and within the top 10 in Africa for government AI readiness, according to recent global assessments of how prepared national governments are to adopt artificial intelligence responsibly and effectively.",
      "A ranking like this can sound abstract, so it is worth breaking down what it actually measures. AI readiness assessments typically look at government strategy and policy around AI, the technical infrastructure in place to support it, and the data systems and skills available within the public sector to act on AI-driven insights.",
      "For businesses, the most immediate implication is around talent and policy direction. A government actively building AI readiness tends to invest in digital skills programs, which over time increases the pool of people equipped to work with data and automation tools. It also signals where regulation is likely headed, which matters for any business currently building or planning to build AI-powered products.",
      "For schools and training institutions, the ranking reflects a broader push toward digital literacy as a foundational skill, not a specialization reserved for computer science students. This shift is already visible in how curricula are evolving and in the growing number of short courses and bootcamps focused on practical AI and data skills.",
      "For the wider economy, the practical effect plays out slowly. Government readiness creates the conditions for AI adoption, but it is individual businesses that decide whether and how to use these tools. Organizations that start experimenting now, even with simple automation and data analysis, build an advantage in skills and process that is hard for slower movers to catch up on later.",
      "The honest takeaway is that a ranking is a signal of direction, not a guarantee of outcome. Businesses that treat it as a cue to invest in their own data practices and staff skills will be the ones who actually benefit from the readiness Kenya is building at a national level.",
    ],
  },
  {
    id: "essential-managed-it-services-for-small-business",
    slug: "essential-managed-it-services-for-small-business",
    title: "10 essential managed IT services for small business",
    category: "Managed Services",
    date: "2024-10-30",
    status: "Published",
    excerpt:
      "What are managed IT services? Small businesses exploring IT outsourcing options can turn to managed services for the support a full in house team would normally provide.",
    metaTitle: "10 Essential Managed IT Services for Small Businesses",
    metaDescription:
      "Learn how managed IT services can help small businesses in Kenya cut costs, boost security, and ensure server uptime without hiring a full in-house team.",
    focusKeyword: "managed IT services",
    featuredImage: "/images/blog-managed-it.png",
    readingMinutes: 7,
    author: "Yagwa Tech Solutions",
    tags: "IT Support, Managed Services, Small Business, Cybersecurity, Server Management",
    content: [
      "What are managed IT services? Put simply, they are the technical support, monitoring, and maintenance functions a full in-house IT department would normally provide, delivered instead by an outside team on a contracted basis. For a small business, this often means access to expertise that would be far too expensive to hire directly.",
      "The first and most basic service is system monitoring, which catches issues with servers, networks, and software before they cause downtime. Most small businesses only discover a problem once a system has already failed, which managed monitoring is designed to prevent.",
      "Closely related is patch management. Software left unpatched accumulates known vulnerabilities over time, and a managed service handles these updates on a schedule rather than relying on someone remembering to do it manually.",
      "Data backup and recovery is the third essential service, and arguably the one businesses regret skipping most when something goes wrong. A proper backup strategy includes regular automated backups stored separately from the main system, tested periodically to confirm they actually restore correctly.",
      "Cybersecurity monitoring rounds out the technical core, watching for unusual activity that might indicate a breach attempt, alongside basic protections like firewalls and endpoint security on every device.",
      "Beyond these core services, a help desk function gives staff a clear place to report issues and get timely responses, rather than each person troubleshooting alone or pulling a manager away from other work.",
      "Cloud management has become increasingly relevant as more small businesses move infrastructure to cloud providers, requiring ongoing attention to cost and configuration that goes beyond the initial setup.",
      "Network management, covering everything from office WiFi to VPN access for remote staff, ensures connectivity stays reliable as a team grows or shifts to hybrid work patterns.",
      "Vendor management can also fall under a managed services contract, where the provider liaises directly with software vendors and internet service providers on your behalf when issues arise.",
      "Strategic IT planning is the service most small businesses underuse, even though it is often the most valuable. Rather than reacting to problems, a managed services provider with a strategic component helps plan technology investments ahead of need, avoiding costly last-minute decisions.",
      "Finally, compliance support helps small businesses meet data protection and industry-specific requirements without needing in-house legal and technical expertise to interpret them.",
      "Taken together, these ten services cover what a small in-house IT team would typically handle, minus the overhead of full-time salaries. For most growing businesses, the right starting point is the two or three services addressing the most immediate pain, with the rest added as the business and its systems grow.",
    ],
  },
  {
    id: "mpesa-daraja-integration-guide-for-kenyan-businesses",
    slug: "mpesa-daraja-integration-guide-for-kenyan-businesses",
    title: "A practical guide to M-Pesa Daraja integration for Kenyan businesses",
    category: "Payments and Fintech",
    date: "2026-02-18",
    status: "Published",
    excerpt:
      "Integrating M-Pesa through the Daraja API is one of the most requested features for Kenyan businesses going digital. Here is what the process actually involves, and what tends to go wrong.",
    metaTitle: "Practical Guide to M-Pesa Daraja API Integration",
    metaDescription:
      "Planning an M-Pesa integration? Read our guide on Safaricom's Daraja API, common checkout callback pitfalls, and how to automate payment reconciliation.",
    focusKeyword: "M-Pesa integration",
    featuredImage: "/images/blog-mpesa-daraja.png",
    readingMinutes: 6,
    author: "Yagwa Tech Solutions",
    tags: "M-Pesa API, Fintech, Payment Gateway, Safaricom, Software Development",
    content: [
      "For any business selling online in Kenya, M-Pesa is rarely optional. Customers expect it as a payment option, and businesses that only offer card payments tend to see noticeably lower conversion at checkout. The technical path to offering it is the Daraja API, Safaricom's official integration layer for M-Pesa.",
      "Daraja exposes several distinct products, and choosing the right one matters more than most teams expect going in. STK Push, formally Lipa Na M-Pesa Online, triggers a payment prompt directly on the customer's phone and is the standard choice for e-commerce checkouts. C2B, or customer to business, is built for scenarios where customers initiate payment themselves through a paybill or till number, common for utility-style payments. B2C handles disbursements out to customers, relevant for refunds, payouts, or loan disbursements.",
      "Getting credentials is the first practical step, requiring registration on the Safaricom developer portal and, for production access, a formal application process that includes business verification. This step alone can take longer than the development work itself, so it is worth starting early rather than leaving it until development is otherwise complete.",
      "The integration itself involves handling asynchronous callbacks, which trips up more implementations than any other part of the process. Unlike a typical card payment flow where you get a synchronous response, STK Push requires your system to wait for a callback from Safaricom confirming success or failure, sent to a URL you provide. If that callback endpoint is not built to handle retries, timeouts, and duplicate notifications gracefully, businesses end up with orders marked as paid that were not, or paid orders never marked as complete.",
      "Sandbox testing behaves differently from production in small but important ways, and teams that test only in sandbox sometimes encounter surprises during the production cutover. Test thoroughly in sandbox, but budget time for a careful, monitored first week in production as well.",
      "Reconciliation is the part of M-Pesa integration most businesses underestimate before they have lived with it. Transaction references, callback timing, and partial failures all need a clear process for matching payments to orders, ideally automated rather than relying on someone manually checking statements at the end of each day.",
      "Done properly, M-Pesa integration is a one-time technical investment that removes a significant amount of friction from the buying experience for Kenyan customers. The businesses that get the most value from it are the ones that plan for the edge cases, callbacks, and reconciliation from the start, rather than treating it as a simple payment button to drop into an existing checkout flow.",
    ],
  },
  {
    id: "signs-your-business-website-needs-a-redesign",
    slug: "signs-your-business-website-needs-a-redesign",
    title: "Seven signs your business website needs a redesign, not just a refresh",
    category: "Web and Branding",
    date: "2026-04-05",
    status: "Published",
    excerpt:
      "Some websites just need new content. Others are quietly costing the business customers every month. Here is how to tell which situation you are actually in.",
    metaTitle: "7 Signs Your Business Website Needs a Full Redesign",
    metaDescription:
      "Is your website turning customers away? Learn the 7 signs that you need a complete website redesign rather than a simple content update.",
    focusKeyword: "website redesign",
    featuredImage: "/images/blog-website-redesign.png",
    readingMinutes: 5,
    author: "Yagwa Tech Solutions",
    tags: "Web Design, User Experience, SEO, Branding, Website Performance",
    content: [
      "Every business website eventually starts to feel dated, but feeling dated and underperforming are two different problems with two different solutions. Updating copy and swapping a few images solves the first. It does nothing for the second.",
      "The first real warning sign is page load time. If your homepage takes more than three seconds to load on a typical mobile connection, you are losing visitors before they see any content at all, regardless of how good that content is.",
      "The second sign is a mobile experience that feels like an afterthought. With most traffic for Kenyan businesses now coming from mobile devices, a site that was clearly designed for desktop first and squeezed onto a phone screen afterward is actively working against you.",
      "The third sign is a navigation structure that makes sense to the people who built it, but not to a first-time visitor. If you regularly have to explain to customers where to find something on your own website, that is a structural problem no amount of new content will fix.",
      "The fourth sign is technical SEO debt, things like missing meta descriptions, broken internal links, slow rendering that search engines struggle to index properly, or a sitemap that has not been updated in years. These issues compound quietly, suppressing rankings without any obvious symptom beyond traffic that never quite grows.",
      "The fifth sign is a content management system that fights your team every time someone tries to update something. If publishing a simple blog post or changing a price requires calling a developer, the platform itself has become the bottleneck.",
      "The sixth sign is a visual identity that no longer matches how the business actually presents itself elsewhere: on social media, in person, or in printed materials. A website that feels disconnected from your other brand touchpoints creates a subtle sense of mistrust, even if visitors cannot articulate exactly why.",
      "The seventh and most direct sign is simply declining conversion over time, despite steady or growing traffic. If people are arriving but not converting at the rate they used to, the experience itself has likely become the obstacle.",
      "If two or more of these apply, a content refresh is unlikely to move the needle much. A proper redesign, addressing structure, performance, and the underlying platform rather than just the surface, tends to be the investment that actually changes outcomes.",
    ],
  },
  {
    id: "digital-transformation-roadmap-for-smes-in-kenya",
    slug: "digital-transformation-roadmap-for-smes-in-kenya",
    title: "Building a realistic digital transformation roadmap for SMEs in Kenya",
    category: "Strategy",
    date: "2026-05-22",
    status: "Published",
    excerpt:
      "Digital transformation does not have to mean replacing everything at once. Here is how growing businesses can build a roadmap that fits their actual budget and pace.",
    metaTitle: "Digital Transformation Roadmap for SMEs in Kenya",
    metaDescription:
      "How growing businesses can build a realistic digital transformation roadmap. Prioritize workflows, plan budgets, and transition smoothly.",
    focusKeyword: "digital transformation roadmap",
    featuredImage: "/images/blog-digital-roadmap.png",
    readingMinutes: 6,
    author: "Yagwa Tech Solutions",
    tags: "Business Strategy, Digital Transformation, SME Growth, Process Automation",
    content: [
      "Digital transformation has become one of those phrases that sounds urgent but rarely comes with a clear starting point. For most small and medium businesses in Kenya, the term conjures images of expensive enterprise software and consultants, which makes it feel out of reach rather than achievable.",
      "The reality is more modest and more useful. Digital transformation, scoped properly, is simply the gradual process of replacing manual, error-prone processes with digital ones that save time and reduce mistakes, in an order that matches your actual budget and risk tolerance.",
      "The first step is an honest audit of where time is currently being lost. This usually surfaces in predictable places: manual data entry between disconnected systems, paper-based approval processes, customer communication scattered across phone calls and messaging apps with no record, and financial reconciliation done by hand at the end of each month.",
      "Once those pain points are identified, the temptation is to fix everything simultaneously. This is almost always a mistake for a business with limited budget and a small team. A more realistic approach prioritizes based on two factors: how much time or money the current process is costing, and how disruptive the fix will be to implement. The best starting points score high on cost and low on disruption.",
      "For many SMEs, this means starting with something like automating invoice generation and payment reminders, or digitizing a single critical workflow such as inventory tracking, rather than attempting a full system overhaul on day one. Early wins build internal confidence and provide a template for tackling larger changes later.",
      "Budget should be planned in phases rather than as one large upfront cost. A roadmap spread across twelve to eighteen months, with each phase tied to a specific, measurable outcome, is both easier to fund and easier to course-correct if a particular approach is not delivering the expected value.",
      "Staff buy-in matters as much as the technology itself. A new system that nobody on the team trusts or understands quietly reverts to the old manual process within months, regardless of how well it was built. Training and clear communication about why a change is happening should be budgeted as part of the project, not treated as an afterthought.",
      "The businesses that get genuine value from digital transformation are rarely the ones with the biggest budgets. They are the ones who sequenced their investments around real pain points, measured results honestly, and treated the roadmap as something to revisit and adjust rather than a fixed plan set in stone at the start.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRecentPosts(excludeSlug?: string, limit = 3) {
  return blogPosts
    .filter((p) => p.slug !== excludeSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
