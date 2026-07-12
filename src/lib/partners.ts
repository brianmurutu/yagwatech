import {
  SafaricomLogo,
  SirBrianLogo,
  TechlinkLogo,
  PaystackLogo,
  AwsLogo,
  MicrosoftLogo,
  CiscoLogo,
  GcpLogo
} from "@/components/BrandLogos";

export interface Partner {
  id: string;
  name: string;
  category: string;
  scope: string;
  description: string;
  logoComponent: React.ComponentType<any>;
}

export const existingPartners: Partner[] = [
  {
    id: "safaricom",
    name: "Safaricom",
    category: "Telecom & Mobile Integration",
    scope: "API integration, payment systems, and core USSD/SMS client channels.",
    description: "Our collaboration with Safaricom enables us to deliver seamless, secure transaction processing systems, direct M-Pesa B2C/C2B disbursements, and high-volume billing portals for our corporate clients.",
    logoComponent: SafaricomLogo,
  },
  {
    id: "sirbrian",
    name: "Sir. Brian & Co.",
    category: "Development Partners",
    scope: "Custom software engineering, agile product development, and technical consulting.",
    description: "Collaborating with Sir. Brian & Co. enables us to scale our development capacity, deliver premium custom software solutions, and leverage expert engineering talent for complex systems.",
    logoComponent: SirBrianLogo,
  },
  {
    id: "techlink",
    name: "Techlink Systems",
    category: "Cloud & Virtualization Partners",
    scope: "Enterprise cloud hosting, virtualization infrastructure, and managed IT systems.",
    description: "Our partnership with Techlink Systems provides robust, enterprise-grade cloud environments, virtualization layers, and high-availability infrastructure solutions for scalable applications.",
    logoComponent: TechlinkLogo,
  },
  {
    id: "paystack",
    name: "Paystack",
    category: "Payment Integration Partners",
    scope: "Seamless digital payment gateway integrations and localized merchant solutions.",
    description: "Working alongside Paystack allows us to embed secure payment checkouts, authorize multi-currency cards, and streamline payouts across Africa for modern platforms.",
    logoComponent: PaystackLogo,
  },
  {
    id: "aws",
    name: "Amazon Web Services",
    category: "Cloud Infrastructure",
    scope: "High-availability cloud architectures and serverless systems.",
    description: "As an AWS Partner, we build, host, and scale auto-scaling microservices, serverless web apps (Lambda), secure databases (RDS), and high-performance CDNs (CloudFront) to ensure 99.99% uptime.",
    logoComponent: AwsLogo,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    category: "Enterprise Cloud & Productivity",
    scope: "Microsoft Azure services, Active Directory, and SaaS platforms.",
    description: "Our Microsoft partnership enables us to build enterprise-grade SaaS systems, integrate Azure AD for single-sign-on (SSO), and customize collaborative business solutions.",
    logoComponent: MicrosoftLogo,
  },
  {
    id: "cisco",
    name: "Cisco Systems",
    category: "Enterprise Security & Networks",
    scope: "Secure routing, firewalls, and hybrid systems configuration.",
    description: "We work alongside Cisco to implement robust cybersecurity postures, configure enterprise firewalls, secure hybrid networks, and design high-speed communication channels for clients.",
    logoComponent: CiscoLogo,
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    category: "Cloud & Advanced Analytics",
    scope: "GKE containers, AI integrations, and big data analysis.",
    description: "Partnering with GCP empowers us to deploy secure Docker/Kubernetes architectures on Google Kubernetes Engine, integrate machine learning services, and run big data queries via BigQuery.",
    logoComponent: GcpLogo,
  },
];
