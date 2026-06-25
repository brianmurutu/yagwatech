import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="bg-gradient-to-br from-brand-blueDark via-brand-blue to-[#1A3F8F] min-h-[70vh] flex items-center">
      <div className="container-wrap text-center py-20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <Search className="h-7 w-7 text-brand-orangeLight" />
        </div>
        <h1 className="mt-6 text-4xl font-medium text-white">Page not found</h1>
        <p className="mt-3 text-white/70 max-w-md mx-auto">
          The page you are looking for may have moved or no longer exists. Let&apos;s get you
          back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-brand-orange px-7 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
          >
            Back to homepage
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-white/40 px-7 py-3 text-sm text-white hover:bg-white/10 transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
