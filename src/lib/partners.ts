import {
  SafaricomLogo,
  KcbLogo,
  EquityLogo,
  CoopLogo,
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
    id: "kcb",
    name: "KCB Bank",
    category: "Financial Technology",
    scope: "Core transactional bank gateway integrations and corporate dashboards.",
    description: "Through our financial gateway partnership with KCB, we architect direct ledger-to-app integrations, custom merchant banking setups, and automated agency banking settlement tools.",
    logoComponent: KcbLogo,
  },
  {
    id: "equity",
    name: "Equity Bank",
    category: "Financial Technology",
    scope: "Bank-to-merchant API interfaces and regional financial infrastructure.",
    description: "Partnering with Equity allows us to craft robust commercial banking endpoints, retail payment reconciliation scripts, and integrated banking features directly within custom ERP systems.",
    logoComponent: EquityLogo,
  },
  {
    id: "coop",
    name: "Co-operative Bank",
    category: "Financial Technology",
    scope: "Commercial payment reconciliations and merchant checkout systems.",
    description: "We work with Co-operative Bank to bridge digital checkouts, automate statement reconciliations, and structure corporate payment pipelines for small businesses and large cooperatives alike.",
    logoComponent: CoopLogo,
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
