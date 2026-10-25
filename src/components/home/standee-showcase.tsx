import Image from "next/image";
import { eventStandeeCaption, eventStandeeImagePath, eventStandeePrice } from "@/lib/site";

/** Source asset dimensions — keeps layout stable without cropping. */
const STANDEE_WIDTH = 682;
const STANDEE_HEIGHT = 1024;

type Props = {
  className?: string;
  caption?: string;
  compact?: boolean;
  /** Softer frame for split-panel product layouts */
  embedded?: boolean;
};

export function StandeeShowcase({
  className = "",
  caption,
  compact = false,
  embedded = false,
}: Props) {
  const defaultCaption = `${eventStandeeCaption} — ${eventStandeePrice}.`;

  const frameClass = embedded
    ? "rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(7,20,40,0.07)]"
    : "rounded-2xl border border-slate-200 bg-slate-50/80 shadow-[0_12px_40px_rgba(7,20,40,0.08)]";

  return (
    <figure className={`overflow-hidden ${frameClass} ${className}`}>
      <Image
        src={eventStandeeImagePath}
        alt="Zust Scan event standee on a wooden easel with QR code and review steps"
        width={STANDEE_WIDTH}
        height={STANDEE_HEIGHT}
        className="h-auto w-full"
        sizes={
          compact
            ? "(max-width: 640px) 240px, 260px"
            : "(max-width: 1024px) 90vw, 320px"
        }
        priority={!compact}
      />
      {caption !== "" ? (
        <figcaption className="border-t border-slate-200 bg-white px-2.5 py-2 text-center text-[11px] leading-4 text-muted sm:text-xs sm:leading-5">
          {caption ?? defaultCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
