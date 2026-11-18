import Link from "next/link";
import { Mark } from "@/components/mark";
import { InstagramIcon, LinkedInIcon } from "@/components/icons";
import { site } from "@/data/site";

const contactButton =
  "btn bg-[var(--color-electric)] text-[var(--color-electric-ink)] shadow-[0_8px_24px_-8px_rgba(2,151,222,0.65)] hover:bg-[var(--color-electric-hover)] hover:shadow-[0_8px_28px_-6px_rgba(58,180,234,0.55)] focus-visible:outline-[var(--color-electric)] active:scale-[0.97]";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-[var(--color-border)]">
      <div data-enter="reveal" className="section py-16 text-center">
        <p className="eyebrow mb-3">Get in touch with us</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {site.name}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-muted-foreground)]">
          Reach out on Instagram — we reply fast.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href={site.instagram} target="_blank" rel="noreferrer" className={contactButton}>
            <InstagramIcon size={16} />
            {site.instagramHandle}
          </Link>
          <Link href={site.linkedIn} target="_blank" rel="noreferrer" className={contactButton}>
            <LinkedInIcon size={16} />
            {site.linkedInLabel}
          </Link>
        </div>
      </div>

      <div className="section flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] py-6 text-sm text-[var(--color-muted-foreground)] sm:flex-row">
        <div className="flex items-center gap-2">
          <Mark size={20} />
          <span>
            © {new Date().getFullYear()} {site.name} · {site.organizer.college}
          </span>
        </div>
        <span>{site.venue.full}</span>
      </div>
    </footer>
  );
}
