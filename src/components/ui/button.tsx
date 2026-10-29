import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:brightness-110 shadow-[0_8px_24px_-8px_var(--accent)]",
  secondary: "border border-line-strong bg-surface/60 text-fg hover:border-fg/40 hover:bg-surface",
  ghost: "text-muted hover:text-fg",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[color,background-color,border-color,filter] duration-200 whitespace-nowrap";

interface ButtonLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
  /** Opens off-site links in a new tab. */
  external?: boolean;
}

/** A link styled as a pill button. Internal paths go through next/link. */
export function ButtonLink({ href, variant = "secondary", icon, external, className = "", children, ...rest }: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {icon}
    </>
  );
  if (external || /^(https?:|mailto:)/.test(href) || href.endsWith(".pdf")) {
    const newTab = external ?? (href.startsWith("http") || href.endsWith(".pdf"));
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

/** A round icon-only link (socials). */
export function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-muted transition-colors hover:border-fg/40 hover:text-fg"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
