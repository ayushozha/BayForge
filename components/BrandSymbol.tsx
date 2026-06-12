type BrandSymbolProps = {
  className?: string;
  idPrefix: string;
};

export default function BrandSymbol({ className, idPrefix }: BrandSymbolProps) {
  const shellGradient = `${idPrefix}-shell-gradient`;
  const surfaceGradient = `${idPrefix}-surface-gradient`;
  const markGradient = `${idPrefix}-mark-gradient`;
  const edgeGradient = `${idPrefix}-edge-gradient`;
  const shineGradient = `${idPrefix}-shine-gradient`;
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
          <stop offset="0" stopColor="#2a2944" />
          <stop offset="0.48" stopColor="#080916" />
          <stop offset="1" stopColor="#13051d" />
        </linearGradient>
        <linearGradient id={surfaceGradient} x1="12" y1="7" x2="47" y2="49">
          <stop offset="0" stopColor="#20223a" />
          <stop offset="0.5" stopColor="#0b0d1d" />
          <stop offset="1" stopColor="#110819" />
        </linearGradient>
        <linearGradient id={markGradient} x1="16" y1="14" x2="47" y2="46">
          <stop offset="0" stopColor="#fff9ff" />
          <stop offset="0.34" stopColor="#d8c6ff" />
          <stop offset="0.66" stopColor="#a75bff" />
          <stop offset="1" stopColor="#43d8ff" />
        </linearGradient>
        <linearGradient id={edgeGradient} x1="9" y1="8" x2="49" y2="50">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="0.42" stopColor="#a964ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#48ddff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={shineGradient} x1="18" y1="17" x2="42" y2="42">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.62" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#46ddff" stopOpacity="0.26" />
        </linearGradient>
        <filter id={glowFilter} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.25" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0.7 0 0 0 0.36 0 0.18 0 0 0.05 0 0 1 0 0.9 0 0 0 0.46 0"
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
      <rect
        x="7.2"
        y="7.2"
        width="43.6"
        height="43.6"
        rx="10"
        fill={`url(#${surfaceGradient})`}
        stroke="#ffffff"
        strokeOpacity="0.07"
        strokeWidth="0.8"
        opacity="0.72"
      />
      <g filter={`url(#${glowFilter})`}>
        <path
          d="M14.3 39h24.1l4.2-5.5h7L44.3 42H14.3V39Z"
          fill={`url(#${markGradient})`}
        />
        <path
          d="M18 33.7h20.4l3.6-6.1H21.1L18 33.7Z"
          fill={`url(#${markGradient})`}
          opacity="0.9"
        />
        <path
          d="M16.4 17.2 20.2 13l22.9 21.3-3.8 4.2-22.9-21.3Z"
          fill={`url(#${markGradient})`}
        />
        <path
          d="m35.2 13.6 4.2-4.5 10 9.4-4.2 4.5-10-9.4Z"
          fill={`url(#${markGradient})`}
        />
        <path
          d="m24.3 8.6 2 3.7 3.7 2-3.7 2-2 3.7-2-3.7-3.7-2 3.7-2 2-3.7Z"
          fill="#fff9ff"
        />
      </g>
      <path
        d="M16.7 39.8h20M20.5 32h17.2M19.8 16.9l20.3 18.9M38.3 13.7l7.9 7.4"
        fill="none"
        stroke="#080916"
        strokeOpacity="0.28"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M17.7 16.2 40.1 37M36.6 13.4l10.7 10"
        fill="none"
        stroke={`url(#${shineGradient})`}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2 12.3h17.2"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
