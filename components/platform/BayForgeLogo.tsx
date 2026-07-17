import Image from "next/image";

export default function BayForgeLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`platform-wordmark${compact ? " platform-wordmark-compact" : ""}`}
      aria-hidden="true"
    >
      <Image
        className="platform-wordmark-image"
        src="/assets/logo-bayforge.png"
        alt=""
        width={320}
        height={240}
        priority
      />
    </span>
  );
}
