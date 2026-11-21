// Small inline icon set (no extra dependency). All icons inherit colour via currentColor.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const Icon = ({ size, children, ...rest }) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...rest}>
    {children}
  </svg>
);

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const BoltIcon = (p) => (
  <Icon {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </Icon>
);

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </Icon>
);

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const CompassIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Icon>
);

export const AngleIcon = (p) => (
  <Icon {...p}>
    <path d="M4 20h16" />
    <path d="M4 20 16 8" />
    <path d="M10 20a6 6 0 0 0-1.8-4.2" />
  </Icon>
);

export const PanelIcon = (p) => (
  <Icon {...p}>
    <path d="M3 8h18l-2 10H5L3 8Z" />
    <path d="M9 8l-1 10M15 8l1 10M4 13h16" />
  </Icon>
);

export const CloudIcon = (p) => (
  <Icon {...p}>
    <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.75 4.75 0 0 1 .5 9.5H7Z" />
  </Icon>
);

export const DropIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />
  </Icon>
);

export const ThermoIcon = (p) => (
  <Icon {...p}>
    <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z" />
  </Icon>
);

export const CoinIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 8h6M9 12h6M11 8c3 0 4 1.5 4 2s-1 2-4 2l4 4" />
  </Icon>
);

export const ChartIcon = (p) => (
  <Icon {...p}>
    <path d="M3 3v18h18" />
    <path d="m7 15 4-5 3 3 5-7" />
  </Icon>
);

export const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const ArrowIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

// Brand mark: a sun rising over a panel grid
export const LogoMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="30" height="30" rx="8" fill="#1B2A3D" stroke="#26364A" />
    <circle cx="16" cy="13" r="4.5" fill="#F3B75B" />
    <path d="M16 4.5v2M8.5 8l1.4 1.4M23.5 8l-1.4 1.4M5.5 13h2M24.5 13h2" stroke="#F3B75B" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 27l2.2-8h13.6L25 27H7Z" fill="#0B1220" stroke="#45D6B0" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12.2 19 11 27M19.8 19 21 27M8.2 23h15.6" stroke="#45D6B0" strokeWidth="1" />
  </svg>
);
