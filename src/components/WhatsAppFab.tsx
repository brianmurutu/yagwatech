import { site } from "@/lib/site";
import { WhatsappIcon } from "@/components/SocialIcons";

export default function WhatsAppFab() {
  return (
    <a
      href={`${site.social.whatsapp}?text=Hello%20YagwaTech%2C%20I%20would%20like%20to%20talk%20about%20a%20project`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Yagwa Tech Solutions on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 overflow-hidden rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-all hover:scale-105"
    >
      {/* Label — expands on hover */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-sm font-semibold text-white transition-all duration-300 group-hover:max-w-[120px] group-hover:pl-4">
        Chat with us
      </span>
      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center">
        <WhatsappIcon className="h-6 w-6 text-white" />
      </span>
    </a>
  );
}
