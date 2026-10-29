"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MobileMenuProps {
  links: { href: string; label: string }[];
  navLabel: string;
  openLabel: string;
  closeLabel: string;
}

export function MobileMenu({ links, navLabel, openLabel, closeLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label={navLabel}
          className="absolute inset-x-0 top-full border-b border-line bg-bg/95 shadow-card backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-muted hover:bg-surface-2 hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
