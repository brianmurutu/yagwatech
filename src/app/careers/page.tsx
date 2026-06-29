import { buildMetadata } from "@/lib/seo";
import CareersClient from "./CareersClient";

export const metadata = buildMetadata({
  title: "Careers",
  description:
    "Join the Yagwa Tech Solutions team. View our open positions in software development, design, and systems engineering in Nairobi, Kenya, and apply online.",
  path: "/careers",
  keywords: [
    "IT jobs Kenya",
    "software developer careers Nairobi",
    "work at Yagwa Tech Solutions",
    "careers in tech Kenya",
  ],
});

export default function CareersPage() {
  return <CareersClient />;
}
