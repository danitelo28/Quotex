export function QuotexLogo({ height = 26 }) {
  return (
    <svg height={height} viewBox="0 0 150 36" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="qx-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0faf59" />
          <stop offset="100%" stopColor="#05c55e" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="28"
        fill="#ffffff"
        fontFamily="Roboto, sans-serif"
        fontWeight="900"
        fontSize="32"
        letterSpacing="-1"
      >
        Q
        <tspan fill="url(#qx-grad)">u</tspan>
        <tspan>o</tspan>
        <tspan>t</tspan>
        <tspan>e</tspan>
        <tspan>x</tspan>
      </text>
      <circle cx="16.5" cy="14" r="8.5" fill="none" stroke="#0faf59" strokeWidth="1.2" opacity="0.0" />
    </svg>
  )
}

export function GlobeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.36666 8.20622C2.66248 5.57837 4.49411 3.41541 6.94277 2.63608C6.0345 4.6496 5.51928 6.42527 5.42018 8.20622H2.36666ZM6.92284 8.20622C7.03549 6.44654 7.61926 4.61824 8.74705 2.32818C8.81644 2.32603 8.88611 2.32495 8.95603 2.32495C8.98541 2.32495 9.01475 2.32514 9.04405 2.32552C10.1727 4.61682 10.7569 6.44586 10.8696 8.20622H6.92284ZM10.8525 9.70622H6.93991C7.08884 11.4396 7.68449 13.276 8.75925 15.5847C8.82461 15.5866 8.89021 15.5876 8.95603 15.5876C8.98139 15.5876 9.00672 15.5875 9.03201 15.5872C10.1075 13.2773 10.7035 11.4402 10.8525 9.70622ZM10.7933 15.3298C11.6865 13.2752 12.2242 11.4792 12.3573 9.70622H15.5454C15.2426 12.3967 13.3299 14.5999 10.7933 15.3298ZM12.3722 8.20622C12.2724 6.41274 11.7506 4.62462 10.8304 2.59356C13.3485 3.33417 15.244 5.52892 15.5454 8.20622H12.3722ZM2.36664 9.70622H5.43511C5.56728 11.4674 6.09869 13.2512 6.98125 15.2886C4.51327 14.5197 2.66398 12.3479 2.36664 9.70622ZM8.95603 0.824951C4.46523 0.824951 0.824707 4.46547 0.824707 8.95628C0.824707 13.4471 4.46523 17.0876 8.95603 17.0876C13.4468 17.0876 17.0874 13.4471 17.0874 8.95628C17.0874 4.46547 13.4468 0.824951 8.95603 0.824951Z"
      />
    </svg>
  )
}

export function EyeShowIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  )
}

export function EyeHideIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 24 }) {
  return (
    <svg width={size} height={size + 1} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle opacity="0.3" cx="12" cy="12.75" r="12" transform="rotate(-90 12 12.75)" fill="white" />
      <path
        d="M12.5497 7.95321L12.1565 8.34628C12.0329 8.4697 11.9645 8.63467 11.9645 8.81028C11.9645 8.98609 12.0329 9.16599 12.1565 9.2894L14.6827 11.8308H6.65668C6.29473 11.8308 6 12.095 6 12.4568V13.013C6 13.3748 6.29473 13.7058 6.65668 13.7058H14.7113L12.1565 16.2421C12.0329 16.3657 11.9645 16.5212 11.9645 16.697C11.9645 16.8726 12.0329 17.033 12.1565 17.1565L12.5497 17.5475C12.8056 17.8033 13.2219 17.8022 13.4778 17.5464L17.8084 13.2153C17.9317 13.0919 18 12.9265 18 12.7494V12.7475C18 12.5718 17.9317 12.4068 17.8084 12.2835L13.4779 7.95321C13.222 7.69721 12.8056 7.69721 12.5497 7.95321Z"
        fill="white"
      />
    </svg>
  )
}

export function CheckIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.91421 1.58579C10.3047 1.19526 10.9379 1.19526 11.3284 1.58579C11.719 1.97631 11.719 2.60948 11.3284 3L4.70711 9.62132C4.31658 10.0118 3.68342 10.0118 3.29289 9.62132L0.671573 7C0.281048 6.60948 0.281048 5.97631 0.671573 5.58579C1.0621 5.19526 1.69526 5.19526 2.08579 5.58579L4 7.5L9.91421 1.58579Z" fill="currentColor" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15.5L4.5 8L5.91 6.59L12 12.67L18.09 6.59L19.5 8L12 15.5Z" />
    </svg>
  )
}

export function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  )
}

export function GoogleIcon({ size = 22 }) {
  return (
    <svg className="icon__google" width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function ArrowUpIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 12.5L12 9L15.5 12.5"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function ArrowDownIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 11.5L12 15L15.5 11.5"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function BellIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  )
}

export function SettingsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  )
}

export function MenuDotsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

export function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#026fd3">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.931-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

export function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#026fd3">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export function TelegramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#026fd3">
      <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />
    </svg>
  )
}

export function PlayStoreIcon({ width = 120, height = 38 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 129 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="129" height="40" rx="6" fill="#ffffff" />
      <g>
        <path d="M25.5 6.5a2.5 2.5 0 00-2.9 1.9L15 26.3l6 6 9.4-9.4L25.5 6.5z" fill="#00C4FF" />
        <path d="M11.3 31.1L17.4 6.7a2.3 2.3 0 012.6-1.6l6.3.2-8.8 8.8-8.8 8.8-6.3-3.1c-1.6-.8-1.6-2.4 0-3.1l8.8-3.2" fill="#A4C639" opacity="0.4" />
        <path d="M21 20.7l-3.6 3.6-1.7-1.7 3.6-3.6 1.7 1.7z" fill="#A4C639" />
      </g>
      <text x="42" y="17" fontFamily="Roboto, sans-serif" fontSize="9" fontWeight="700" fill="#5f6368">GET IT ON</text>
      <text x="42" y="30" fontFamily="Roboto, sans-serif" fontSize="16" fontWeight="900" fill="#3c4043">Google Play</text>
    </svg>
  )
}

export function PwaIcon({ width = 120, height = 38 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 129 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="129" height="40" rx="6" fill="#ffffff" />
      <rect x="6" y="7" width="26" height="26" rx="5" fill="#1c1f2d" />
      <circle cx="19" cy="20" r="6" fill="none" stroke="#0faf59" strokeWidth="2" />
      <text x="42" y="17" fontFamily="Roboto, sans-serif" fontSize="9" fontWeight="700" fill="#5f6368">WEB APP</text>
      <text x="42" y="30" fontFamily="Roboto, sans-serif" fontSize="16" fontWeight="900" fill="#3c4043">Install PWA</text>
    </svg>
  )
}

export function ArrowChevronRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M6.52432 5.20379C6.26968 4.92877 6.26968 4.49246 6.52432 4.21744C6.79664 3.92332 7.24999 3.92915 7.5079 4.22539L11.4757 8.51083C11.5998 8.64491 11.6667 8.82538 11.6667 9.00401C11.6667 9.18867 11.6008 9.36204 11.4757 9.49718L7.5079 13.7826C7.23955 14.0725 6.79268 14.0725 6.52432 13.7826C6.26968 13.5076 6.26968 13.0713 6.52432 12.7963L10.0426 8.99631L6.52432 5.20379Z" />
    </svg>
  )
}
