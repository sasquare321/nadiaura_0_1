import * as React from "react"

type IconProps = { size?: number; color?: string }

const baseSvgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  role: "img" as const,
  "aria-hidden": true,
  focusable: "false" as const,
})

/* ------------------------------ ICONS ------------------------------ */

export const HomeIcon = ({ size = 22, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10.2L12 4l8 6.2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9.8Z" />
    <path d="M10 22v-7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v7" />
  </svg>
)

export const BarChartIcon = ({ size = 22, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16" />
    <path d="M7 20V11.5a1.5 1.5 0 0 1 1.5-1.5H9a1.5 1.5 0 0 1 1.5 1.5V20" />
    <path d="M13 20V6.5A1.5 1.5 0 0 1 14.5 5h.5A1.5 1.5 0 0 1 16.5 6.5V20" />
    <path d="M19 20v-5.5a1.5 1.5 0 0 0-1.5-1.5H17a1.5 1.5 0 0 0-1.5 1.5V20" opacity="0.0" />
  </svg>
)

export const SparklesIcon = ({ size = 22, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color}>
    <path d="M12 2l1.7 5.2L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.8L12 2z" />
    <path d="M19 13.8l.85 2.6L22 17l-2.15.7L19 20l-.85-2.3L16 17l2.15-.6L19 13.8z" />
    <path d="M5 17.6l.6 1.8L7 20l-1.4.45L5 22l-.6-1.55L3 20l1.4-.6L5 17.6z" />
  </svg>
)

export const CameraIcon = ({ size = 22, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-3.2l-1.2-2a2 2 0 0 0-1.7-1H10.1a2 2 0 0 0-1.7 1l-1.2 2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
    <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </svg>
)

export const AlertIcon = ({ size = 22, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 4.2 2.2 18.3A2.2 2.2 0 0 0 4.1 22h15.8a2.2 2.2 0 0 0 1.9-3.7L13.7 4.2a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v5" />
    <path d="M12 18h.01" />
  </svg>
)

export const BellIcon = ({ size = 22, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 16 18 10Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)

export const ArrowLeftIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 6.5 9 12l5.5 5.5" />
  </svg>
)

export const ArrowRightIcon = ({ size = 16, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 6.5 15 12l-5.5 5.5" />
  </svg>
)

export const HeartIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M12 21.2 4.6 13.8a5.5 5.5 0 0 1 7.8-7.8l-.4-.4.4.4a5.5 5.5 0 0 1 7.8 7.8L12 21.2Z" />
  </svg>
)

export const MoonIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M21 13a8.8 8.8 0 1 1-10-10 7 7 0 0 0 10 10Z" />
  </svg>
)

export const WindIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h9a2 2 0 1 0-2-2" />
    <path d="M3 12h14a2.5 2.5 0 1 1-2.5 2.5" />
    <path d="M3 16h10a2 2 0 1 0-2 2" />
  </svg>
)

export const StepsIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3 4 14h8l-1 7 9-11h-8l1-7Z" />
  </svg>
)

export const ForkIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2" />
    <path d="M9 2v20" />
    <path d="M18 22V13a4 4 0 0 1 4-4V2" />
  </svg>
)

export const DropletIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M12 2.6 17.7 8.3a8 8 0 1 1-11.4 0L12 2.6Z" />
  </svg>
)

export const BrainIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.6 2.1A2.6 2.6 0 0 1 12 4.6v14.8a2.6 2.6 0 0 1-5.1-.5 2.6 2.6 0 0 1-3-3.2 3.1 3.1 0 0 1-.4-5.7 2.6 2.6 0 0 1 1.4-4.3 2.6 2.6 0 0 1 2-3 2.6 2.6 0 0 1 2.7-.6Z" />
    <path d="M14.4 2.1A2.6 2.6 0 0 0 12 4.6v14.8a2.6 2.6 0 0 0 5.1-.5 2.6 2.6 0 0 0 3-3.2 3.1 3.1 0 0 0 .4-5.7 2.6 2.6 0 0 0-1.4-4.3 2.6 2.6 0 0 0-2-3 2.6 2.6 0 0 0-2.7-.6Z" />
  </svg>
)

export const UserIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-1.4a4.6 4.6 0 0 0-4.6-4.6H8.6A4.6 4.6 0 0 0 4 19.6V21" />
    <path d="M12 12a4.2 4.2 0 1 0 0-8.4A4.2 4.2 0 0 0 12 12Z" />
  </svg>
)

export const SettingsIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
    <path d="M19.4 15.2a1.8 1.8 0 0 0 .4 2l.2.2a2 2 0 0 1-2.8 2.8l-.2-.2a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6V22a2 2 0 0 1-4 0v-.3a1.8 1.8 0 0 0-1.1-1.6 1.8 1.8 0 0 0-2 .4l-.2.2A2 2 0 0 1 3.8 18l.2-.2a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1.1H2.5a2 2 0 0 1 0-4h.3a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.4-2l-.2-.2A2 2 0 0 1 6.6 4.6l.2.2a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1.1-1.6V2.5a2 2 0 0 1 4 0v.3a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.4l.2-.2a2 2 0 0 1 2.8 2.8l-.2.2a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1.1h.3a2 2 0 0 1 0 4h-.3a1.8 1.8 0 0 0-1.6 1.1Z" />
  </svg>
)

export const XIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
)

export const CheckIcon = ({ size = 18, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const PhoneIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9V20a2 2 0 0 1-2.2 2 20 20 0 0 1-8.7-3.1A19.7 19.7 0 0 1 4.1 12a20 20 0 0 1-3.1-8.8A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.7c.13 1 .36 2 .7 2.9a2 2 0 0 1-.45 2.1l-1 1a16 16 0 0 0 6.4 6.4l1-1a2 2 0 0 1 2.1-.45c.9.34 1.9.57 2.9.7A2 2 0 0 1 22 16.9Z" />
  </svg>
)

export const MessageIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H8l-5 5V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
  </svg>
)

export const MicOffIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2l20 20" />
    <path d="M10 10v2.4a3.2 3.2 0 0 0 5.5 2.2" />
    <path d="M15.5 9.7V5a3.5 3.5 0 0 0-6.9-.7" />
    <path d="M18 16.8A8 8 0 0 1 6 12v-2" />
    <path d="M12 19v3" />
    <path d="M8 22h8" />
  </svg>
)

export const TrendUpIcon = ({ size = 16, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l6-6 4 4 8-9" />
    <path d="M16 6h5v5" />
  </svg>
)

export const FlameIcon = ({ size = 18, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M12.7 2.6c.3 2.2-.6 3.8-1.8 5.1-1.1 1.1-2.2 2.2-2 4.1.1 1.2.8 2 1.6 2.4-.3-1.6.6-2.7 1.7-3.8 1.2-1.2 2.6-2.7 2-5.2 2.3 1.4 4.1 4.1 4.1 6.9A6.3 6.3 0 1 1 6.5 14c0-2.4 1.3-4.7 3.2-6.3.3 1.6 1.2 2.5 2.3 3.6.9.9 1.5 1.8 1.4 3.2 1.1-.5 2.1-1.7 2.1-3.5 0-2.7-1.8-4.2-3.1-5.4-.7-.7-1.2-1.4-1.7-3Z" />
  </svg>
)

export const ShieldIcon = ({ size = 16, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
)

export const WalletIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5v-9Z" />
    <path d="M3 10h19" />
  </svg>
)

export const BeachIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M13.4 5.6a2.2 2.2 0 1 0-2.2-2.2 2.2 2.2 0 0 0 2.2 2.2ZM18.4 10.3l-1.2-3.1a1.8 1.8 0 0 0-1.7-1.1c-.5 0-.9.1-1.2.4l-1.3 1.1-.3-.6a1.1 1.1 0 0 0-1-.6c-.5 0-.9.3-1.1.7l-.5 1.2H7.2a1.1 1.1 0 1 0 0 2.2h4a1.1 1.1 0 0 0 1-.7l.2-.5 1.2 2.7-1.5 1.3-2.5 5.5H7.2a1.1 1.1 0 1 0 0 2.2h3a1.1 1.1 0 0 0 1-.6l2-3.5 1 1V21a1.1 1.1 0 1 0 2.2 0v-5.6c0-.3-.1-.6-.3-.8l-2.3-2.4 1.3-2.9.9 2a1.1 1.1 0 0 0 1 .7h3a1.1 1.1 0 0 0 0-2.2h-2.6Z" />
  </svg>
)

export const HomeIconFilled = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z" />
  </svg>
)

export const BookIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  </svg>
)

export const PlusIcon = ({ size = 18, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)

export const EditIcon = ({ size = 16, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" />
    <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
)

export const LogoutIcon = ({ size = 18, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17 21 12l-5-5" />
    <path d="M21 12H10" />
  </svg>
)

export const MuscleIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M21.2 13.4 22.5 12l-1.3-1.4-3.2 3.2-7.7-7.7 3.2-3.2L12 1.5 10.6 3 9.2 1.7 6.3 4.6 4.9 3.2 3.2 4.9l1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4 4.9 4.9-1.5 1.5 1.4 1.4-.9.9 1.4 1.4.9-.9 1.4 1.4 1.5-1.5 1.5 1.5 4.9-4.9Z" />
  </svg>
)

/* Brand icons: kept brand-accurate (best practice) */
export const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg {...baseSvgProps(size)}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export const AppleIcon = ({ size = 20, color = "white" }: { size?: number; color?: string }) => (
  <svg {...baseSvgProps(size)} fill={color}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

export const LightbulbIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg {...baseSvgProps(size)} fill={color} stroke="none">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
  </svg>
)