type BrandSymbolProps = {
  className?: string;
  idPrefix: string;
};

export default function BrandSymbol({ className, idPrefix }: BrandSymbolProps) {
  const shellGradient = `${idPrefix}-shell-gradient`;
  const markGradient = `${idPrefix}-mark-gradient`;
  const edgeGradient = `${idPrefix}-edge-gradient`;
  const glowFilter = `${idPrefix}-glow`;

  return (
    <svg
      className={className}
      viewBox="0 0 58 58"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={shellGradient} x1="9" y1="6" x2="50" y2="54">
          <stop offset="0" stopColor="#24233e" />
          <stop offset="0.52" stopColor="#080a1b" />
          <stop offset="1" stopColor="#13051f" />
        </linearGradient>
        <linearGradient id={markGradient} x1="14" y1="15" x2="44" y2="43">
          <stop offset="0" stopColor="#f8f4ff" />
          <stop offset="0.42" stopColor="#c95cff" />
          <stop offset="1" stopColor="#46ddff" />
        </linearGradient>
        <linearGradient id={edgeGradient} x1="9" y1="8" x2="49" y2="50">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="0.5" stopColor="#b936ff" stopOpacity="0.48" />
          <stop offset="1" stopColor="#39d5ff" stopOpacity="0.44" />
        </linearGradient>
        <filter id={glowFilter} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.7" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0.72 0 0 0 0.46 0 0.16 0 0 0.08 0 0 1 0 0.92 0 0 0 0.72 0"
            result="color"
          />
          <feMerge>
            <feMergeNode in="color" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="2.5" y="2.5" width="53" height="53" rx="13" fill={`url(#${shellGradient})`} />
      <rect
        x="3"
        y="3"
        width="52"
        height="52"
        rx="12.5"
        fill="none"
        stroke={`url(#${edgeGradient})`}
        strokeWidth="1.4"
      />
      <path
        d="M15 17.5h31l-7.4 8.1H20.3L15 17.5Zm3.9 11.1h23.5l-6.2 7.2H23.6l-4.7-7.2Zm5.7 10.1h13.1l-4.4 5.1h-5.4l-3.3-5.1Z"
        fill={`url(#${markGradient})`}
        filter={`url(#${glowFilter})`}
      />
      <path
        d="M18.8 18.4 29 44.2M43.1 18.4 30.9 44.2"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.26"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M17 15.2h28.2"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
