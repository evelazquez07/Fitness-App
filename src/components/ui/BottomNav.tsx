"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: IconHome },
  { href: "/rutinas", label: "Rutinas", icon: IconDumbbell },
  { href: "/historial", label: "Historial", icon: IconChart },
  { href: "/logros", label: "Logros", icon: IconTrophy },
  { href: "/perfil", label: "Perfil", icon: IconUser },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg justify-between px-4 py-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition"
            >
              <Icon
                className={`h-5 w-5 transition ${activo ? "text-brand-400" : "text-white/40"}`}
              />
              <span
                className={`text-[11px] transition ${activo ? "font-semibold text-brand-400" : "text-white/40"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDumbbell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M6 7v10M18 7v10M2 10v4M22 10v4M6 12h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrophy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        d="M8 4h8v5a4 4 0 0 1-8 0V4Z M5 5H3v2a3 3 0 0 0 3 3 M19 5h2v2a3 3 0 0 1-3 3 M10 15v2H8v2h8v-2h-2v-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 6-5 8-5s6.5 1 8 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
