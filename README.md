# Yagwa Tech Solutions website

A full rebuild of yagwatech.com on Next.js 14, replacing the Laravel admin dashboard
setup with a fast, statically generated site that is easier to maintain and far
stronger on SEO.

## What is included

- Homepage, About, Services (index plus 12 full detail pages), Portfolio (index plus
  5 project detail pages), Pricing, Blog (index plus 6 full articles), FAQs, Contact,
  Get a quote, Privacy policy, Terms and conditions
- Working contact form, quote request form, and newsletter signup, all wired to
  Resend for email delivery
- Full SEO setup: per page metadata, Open Graph tags, JSON-LD structured data
  (Organization, Service, FAQPage, Article, BreadcrumbList schemas), dynamic
  sitemap.xml, robots.txt, and a web manifest
- Brand colors preserved throughout (`#0B3D91` blue, `#F47B20` orange)
- No long em dashes anywhere in the copy, per your style preference
- Mobile responsive on every page

## Tech stack

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS for styling
- Zod for form validation
- Resend for transactional email
- lucide-react for icons, plus a small set of custom inline SVGs for brand or social
  icons since lucide-react no longer ships those

## Project structure

```
src/
  app/                  All pages and API routes (App Router)
    services/[slug]/    Dynamic service detail pages, 12 generated at build time
    portfolio/[slug]/   Dynamic project detail pages, 5 generated at build time
    blog/[slug]/        Dynamic blog post pages, 6 generated at build time
    api/contact/        Contact form endpoint
    api/quote/          Quote request endpoint
    api/newsletter/     Newsletter signup endpoint
    sitemap.ts          Auto generated sitemap covering every route
    robots.ts           Auto generated robots.txt
    manifest.ts         Web app manifest
  components/           Shared UI: Header, Footer, forms, FAQ accordion, etc
  lib/                  All site content lives here as typed data
    site.ts             Company name, contact details, social links
    services.ts         All 12 services with full content, FAQs, process steps
    projects.ts         Portfolio project data
    blog.ts             All 6 blog posts with full article content
    team.ts             Team members and testimonials
    faqs.ts             FAQ page content
    seo.ts              Shared metadata builder
    validation.ts       Zod schemas for the three forms
```

## Updating content

Everything on the site is plain TypeScript data, not a database, which means content
changes are version controlled and reviewable like code, but it also means a content
editor needs basic comfort opening a file and editing text between quotes.

- To edit a service: open `src/lib/services.ts`, find the entry by `slug`, edit any
  field. The page rebuilds automatically on the next deploy.
- To add a blog post: open `src/lib/blog.ts`, copy an existing post object, change
  the `slug` (used in the URL), and fill in the fields. It will appear on `/blog`
  automatically, newest first.
- To add a portfolio project: same pattern in `src/lib/projects.ts`.
- To change contact details, phone number, or social links: edit `src/lib/site.ts`,
  this updates the header, footer, and every page that references it.

If you would prefer a visual admin dashboard instead of editing files directly, the
natural next step is wiring this data layer to a headless CMS (Sanity, Contentful,
or a small custom Laravel API) so non technical staff can edit content through a UI.
The site is structured so that swap is straightforward, since all content already
flows through single typed functions like `getServiceBySlug` and `getBlogPostBySlug`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
RESEND_API_KEY=        # required for contact form, quote form, and newsletter to send email
RESEND_AUDIENCE_ID=    # optional, only needed if using Resend's audience feature for newsletter
```

Get a Resend API key at https://resend.com. The free tier covers a small business
website comfortably. Without this key, the forms will show a clear error message to
visitors instead of silently failing.

By default, emails send from `onboarding@resend.dev`, which works immediately but is
not your own domain. Once you verify yagwatech.com in Resend, update the `from`
address in the three files under `src/app/api/` to send from your own domain
(for example, `noreply@yagwatech.com`) instead.

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploying to Vercel

1. Push this codebase to a GitHub repository
2. Import the repository in Vercel
3. Add the `RESEND_API_KEY` environment variable in the Vercel project settings
   (Settings then Environment Variables)
4. Deploy. Vercel will detect Next.js automatically, no configuration needed
5. Once deployed, point yagwatech.com's DNS to Vercel following their domain setup
   instructions
6. Submit the sitemap at `https://yagwatech.com/sitemap.xml` to Google Search Console

## SEO notes for the migration

- All page titles and meta descriptions are unique and written for search intent,
  not just copied from page headings
- Every service, project, and blog post has its own canonical URL and structured
  data, which the previous setup did not have
- If the old Laravel site has existing Google rankings on specific URLs, set up 301
  redirects from those old paths to the matching new paths before switching DNS,
  so you do not lose existing search equity. This is best done with the redirects
  array in `next.config.js` once you confirm the exact old URL structure
- Update `src/lib/site.ts` with real social media URLs before launch, the current
  ones are placeholders matching what was visible on the live site

## What was intentionally left as a next step

- Real photography and project screenshots. Every visual placeholder uses brand
  color gradients with icons rather than stock photography, since real photos of
  your team, office, and project screenshots will look far more credible than any
  generic image
- Google Analytics or a privacy friendly alternative (Plausible, Fathom) is not
  wired in yet, add the tracking script to `src/app/layout.tsx` once you choose one
- The og-image.png referenced in metadata needs to be created and placed in
  `public/og-image.png` for social share previews to show a proper image
