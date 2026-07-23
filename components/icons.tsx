import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---------- Category icons ---------- */

export function IconMining(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 21l6.5-6.5" />
      <path d="M14 4l6 6" />
      <path d="M10 8c2.5-2.5 6.5-3 9-1-2 2.5-2.5 6.5-1 9l-2 2c-2.5-1.5-6.5-1-9 1" />
    </Base>
  );
}
export function IconEnergy(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
    </Base>
  );
}
export function IconWater(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 3c3.5 4.2 6.5 7.6 6.5 11a6.5 6.5 0 11-13 0C5.5 10.6 8.5 7.2 12 3z" />
      <path d="M9 14.5a3.2 3.2 0 003 3.2" />
    </Base>
  );
}
export function IconAgro(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 21V10" />
      <path d="M12 10C12 5.5 15 3 20 3c0 5-2.5 8-8 7z" />
      <path d="M12 14c0-3.5-2.5-5.5-6.5-5.5 0 4 2.2 6.3 6.5 5.5z" />
    </Base>
  );
}
export function IconManufacturing(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 21V9l6 4V9l6 4V4h6v17H3z" />
      <path d="M8 17h.01M12 17h.01M16 17h.01" />
    </Base>
  );
}
export function IconInfrastructure(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M2 20h20" />
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M9 20v-6h6v6" />
      <path d="M12 9h.01" />
    </Base>
  );
}
export function IconPorts(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
      <path d="M5 16l1.2-6H12l6-.01L19 16" />
      <path d="M9 10V6h6v4" />
    </Base>
  );
}
export function IconRealEstate(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4v18" />
      <path d="M12 21V11l7 3v7" />
      <path d="M8 9h.01M8 13h.01M8 17h.01" />
    </Base>
  );
}

export const CATEGORY_ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  mining: IconMining,
  energy: IconEnergy,
  water: IconWater,
  agro: IconAgro,
  manufacturing: IconManufacturing,
  infrastructure: IconInfrastructure,
  ports: IconPorts,
  realestate: IconRealEstate,
};

/* ---------- UI icons ---------- */

export function IconShield(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5l8-3z" />
      <path d="M8.5 12l2.4 2.4L15.5 9.8" />
    </Base>
  );
}
export function IconCheck(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Base>
  );
}
export function IconArrowRight(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </Base>
  );
}
export function IconSearch(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </Base>
  );
}
export function IconGlobe(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.7 2.6 4 5.6 4 9s-1.3 6.4-4 9c-2.7-2.6-4-5.6-4-9s1.3-6.4 4-9z" />
    </Base>
  );
}
export function IconMapPin(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 21s-7-5.4-7-11a7 7 0 1114 0c0 5.6-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Base>
  );
}
export function IconLock(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </Base>
  );
}
export function IconDoc(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M6 2h8l4 4v16H6V2z" />
      <path d="M14 2v4h4M9 12h6M9 16h6" />
    </Base>
  );
}
export function IconHeart(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 20.5s-8-4.9-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9.5c0 6.1-8 11-8 11z" />
    </Base>
  );
}
export function IconMessage(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 5h16v11H8l-4 4V5z" />
    </Base>
  );
}
export function IconEye(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </Base>
  );
}
export function IconMenu(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}
export function IconClose(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}
export function IconStar(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 3l2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8L12 3z" />
    </Base>
  );
}
export function IconBuilding(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3" />
    </Base>
  );
}
export function IconChart(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-8" />
    </Base>
  );
}
export function IconUsers(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
      <path d="M16 5a3.2 3.2 0 010 6M18.5 15.5c1.6.8 2.7 2.3 3 4.5" />
    </Base>
  );
}
export function IconHandshake(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 7L2 13l3 1.5" />
      <path d="M20 7l2 6-3 1.5" />
      <path d="M12 6L8.5 9.5a1.8 1.8 0 002.5 2.5L12 11l4.5 4.5a1.7 1.7 0 01-2.4 2.4l-.6-.6a1.7 1.7 0 01-2.4 2.4L10 18.5" />
      <path d="M4 7l4-1.5L12 6l4.5-.5L20 7" />
    </Base>
  );
}
export function IconChevronDown(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M6 9l6 6 6-6" />
    </Base>
  );
}
export function IconPlus(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}
export function IconBell(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M6 9a6 6 0 0112 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z" />
      <path d="M10 19a2 2 0 004 0" />
    </Base>
  );
}
