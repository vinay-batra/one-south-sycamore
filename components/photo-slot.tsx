/**
 * Stand-in for a photograph that hasn't been shot or uploaded yet.
 *
 * Every one of these is a real slot in the layout — when Vinay uploads
 * Vince's photos, the slot takes an `src` and renders the image instead,
 * so the page never reflows between draft and launch.
 */
import Image from "next/image";

type Props = {
  label: string;
  src?: string | null;
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function PhotoSlot({ label, src, alt, className = "", priority }: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-paper-warm ${className}`}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-sage ${className}`}
      role="img"
      aria-label={`Photo placeholder: ${label}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 14px, rgba(46,70,54,0.055) 14px 15px)",
        }}
      />
      <span className="eyebrow relative z-10 px-4 text-center text-forest/70">
        {label}
      </span>
    </div>
  );
}
