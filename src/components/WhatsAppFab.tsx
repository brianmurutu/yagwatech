import { site } from "@/lib/site";
import { WhatsappIcon } from "@/components/SocialIcons";

export default function WhatsAppFab() {
  return (
    <a
      href={`${site.social.whatsapp}?text=Hello%20YagwaTech%2C%20I%20would%20like%20to%20talk%20about%20a%20project`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform"
    >
      <WhatsappIcon className="h-6 w-6 text-white" />
    </a>
  );
}
