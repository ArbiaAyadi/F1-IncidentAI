// Icône Voiture de course
export const RaceCarIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M58 32c0-3-2-5-5-5h-8l-6-8h-14l-4 8H8c-3 0-5 2-5 5v8c0 3 2 5 5 5h2c0 3 2 5 5 5s5-2 5-5h24c0 3 2 5 5 5s5-2 5-5h2c3 0 5-2 5-5v-8zm-43 13c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm34 0c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm-25-18l3-6h10l4 6H24z"/>
  </svg>
);

// Icône Trophée
export const TrophyIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M44 8h-4V4H24v4h-4c-2 0-4 2-4 4v8c0 6 4 11 10 13v7h-4c-3 0-6 2-6 6v4h28v-4c0-4-3-6-6-6h-4v-7c6-2 10-7 10-13v-8c0-2-2-4-4-4zM16 20v-8h4v12c-2-1-4-3-4-4zm32 0c0 1-2 3-4 4V12h4v8z"/>
  </svg>
);

// Icône Statistiques
export const StatsIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M8 48h8V28H8v20zm12-28v28h8V20h-8zm12 12v16h8V32h-8zm12-12v28h8V20h-8z"/>
  </svg>
);

// Icône Cible/Target
export const TargetIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 40c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0-24c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/>
  </svg>
);

// Icône Chronométre
export const TimerIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 12c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 36c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z"/>
    <path d="M34 20h-4v14l12 7 2-3-10-6z"/>
  </svg>
);

// Icône Éclair (vitesse)
export const LightningIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M28 4L12 36h12L20 60l28-32H36l8-24z"/>
  </svg>
);

// Icône Médaille
export const MedalIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 36c-6.6 0-12-5.4-12-12V4h24v20c0 6.6-5.4 12-12 12z"/>
    <circle cx="32" cy="44" r="16"/>
    <text x="32" y="52" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#000">1</text>
  </svg>
);

// Icône Dashboard/Compteur
export const DashboardIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 8C18.7 8 8 18.7 8 32c0 8.8 4.7 16.5 11.7 20.7l3.1-3.1C18.2 46.5 16 39.6 16 32c0-8.8 7.2-16 16-16s16 7.2 16 16c0 7.6-2.2 14.5-6.8 17.6l3.1 3.1C51.3 48.5 56 40.8 56 32c0-13.3-10.7-24-24-24z"/>
    <path d="M32 28l12 12-4 4-12-12z"/>
  </svg>
);

// Icône Drapeau à damier
export const CheckeredFlagIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <rect x="8" y="8" width="8" height="8"/>
    <rect x="24" y="8" width="8" height="8"/>
    <rect x="40" y="8" width="8" height="8"/>
    <rect x="16" y="16" width="8" height="8"/>
    <rect x="32" y="16" width="8" height="8"/>
    <rect x="48" y="16" width="8" height="8"/>
    <rect x="8" y="24" width="8" height="8"/>
    <rect x="24" y="24" width="8" height="8"/>
    <rect x="40" y="24" width="8" height="8"/>
    <rect x="16" y="32" width="8" height="8"/>
    <rect x="32" y="32" width="8" height="8"/>
    <rect x="48" y="32" width="8" height="8"/>
    <rect x="4" y="8" width="4" height="48"/>
  </svg>
);

// Icône Casque de pilote
export const HelmetIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 8C18.7 8 8 18.7 8 32v8h48v-8c0-13.3-10.7-24-24-24zm-12 24c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm24 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
    <path d="M8 44v8h48v-8H8z"/>
  </svg>
);