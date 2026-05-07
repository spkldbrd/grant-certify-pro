import { forwardRef } from "react";
import logo from "@/assets/grant-writing-usa-logo.png";
import signature from "@/assets/becky-helm-signature.png";

export type WorkshopType = "Grant Writing" | "Grant Management" | "Subaward";

export interface CertificateProps {
  name: string;
  agency: string;
  workshop: WorkshopType;
  city?: string;
  date: string; // formatted date string
  certificateId: string;
}

const WORKSHOP_COPY: Record<WorkshopType, { title: string; body: string; hours: string }> = {
  "Grant Writing": {
    title: "Grant Writing Workshop",
    body: "having successfully completed the Grant Writing USA two-day intensive workshop in the principles, practices, and craft of competitive federal and foundation grant writing.",
    hours: "Sixteen (16) Contact Hours",
  },
  "Grant Management": {
    title: "Grant Management Workshop",
    body: "having successfully completed the Grant Writing USA two-day intensive workshop in post-award grant administration, compliance, and the Uniform Guidance (2 CFR 200).",
    hours: "Sixteen (16) Contact Hours",
  },
  Subaward: {
    title: "Subaward Management Workshop",
    body: "having successfully completed the Grant Writing USA workshop in subaward management, monitoring, risk assessment, and pass-through entity responsibilities under 2 CFR 200.",
    hours: "Eight (8) Contact Hours",
  },
};

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ name, agency, workshop, city, date, certificateId }, ref) => {
    const copy = WORKSHOP_COPY[workshop];

    return (
      <div
        ref={ref}
        className="cert-paper relative mx-auto aspect-[1.414/1] w-full max-w-[1100px] overflow-hidden"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {/* Decorative double border */}
        <div className="absolute inset-[18px] border-[3px] border-[var(--crimson)]" />
        <div className="absolute inset-[26px] border border-[var(--crimson)]/40" />
        <div className="absolute inset-[34px] border border-[var(--gold-deep)]/50" />

        {/* Corner ornaments */}
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <CornerOrnament key={corner} corner={corner} />
        ))}

        {/* Subtle paper texture */}
        <div className="cert-noise pointer-events-none absolute inset-0 opacity-60" />

        {/* Watermark seal behind content */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Seal className="h-[520px] w-[520px] opacity-[0.05]" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-between px-20 py-14 text-center">
          {/* Header */}
          <div className="flex flex-col items-center">
            <img
              src={logo}
              alt="Grant Writing USA"
              className="h-20 w-auto"
              crossOrigin="anonymous"
            />
            <div className="mt-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.5em] text-[var(--navy)]">
              <span className="h-px w-10 bg-[var(--crimson)]/60" />
              Office of Professional Education
              <span className="h-px w-10 bg-[var(--crimson)]/60" />
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col items-center">
            <p
              className="text-[13px] uppercase tracking-[0.45em] text-[var(--navy)]/80"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              This Certificate is Proudly Presented to
            </p>
            <h1
              className="mt-4 text-[64px] leading-none text-[var(--crimson-deep)]"
              style={{ fontFamily: "var(--font-script)", letterSpacing: "0.01em" }}
            >
              {name || "Recipient Name"}
            </h1>
            <div className="mt-2 h-px w-[70%] bg-gradient-to-r from-transparent via-[var(--crimson)]/60 to-transparent" />
            {agency && (
              <p
                className="mt-3 text-[15px] uppercase tracking-[0.35em] text-[var(--navy)]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
              >
                {agency}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="max-w-[78%]">
            <p className="text-[20px] italic leading-relaxed text-[var(--ink)]/85">
              {copy.body}
            </p>
            <p
              className="mt-5 text-[13px] uppercase tracking-[0.4em] text-[var(--crimson)]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
            >
              {copy.title} &middot; {copy.hours}
            </p>
          </div>

          {/* Footer signatures */}
          <div className="grid w-full grid-cols-3 items-end gap-8">
            <div className="flex flex-col items-center">
              <p
                className="font-display text-[26px] leading-none text-[var(--navy)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {date}
              </p>
              <div className="mt-2 h-px w-full bg-[var(--ink)]/40" />
              <p
                className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[var(--navy)]/70"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Date of Completion
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Seal className="h-24 w-24" />
            </div>

            <div className="flex flex-col items-center">
              <img
                src={signature}
                alt="Becky Helm signature"
                className="h-14 w-auto object-contain"
                crossOrigin="anonymous"
              />
              <div className="h-px w-full bg-[var(--ink)]/40" />
              <p
                className="mt-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--navy)]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Becky Helm
              </p>
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-[var(--navy)]/70"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Chief Executive Officer
              </p>
            </div>
          </div>

          {/* Footer meta */}
          <div
            className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-16 text-[9px] uppercase tracking-[0.3em] text-[var(--navy)]/60"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <span>Certificate No. {certificateId}</span>
            <span>{city ? `Issued in ${city}` : "Grant Writing USA \u00AE"}</span>
          </div>
        </div>
      </div>
    );
  },
);
Certificate.displayName = "Certificate";

function CornerOrnament({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: "top-[34px] left-[34px]",
    tr: "top-[34px] right-[34px] rotate-90",
    bl: "bottom-[34px] left-[34px] -rotate-90",
    br: "bottom-[34px] right-[34px] rotate-180",
  }[corner];
  return (
    <svg
      className={`absolute ${pos} text-[var(--crimson)]`}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
    >
      <path
        d="M2 30 Q2 2 30 2 M2 18 Q2 14 6 14 L18 14 Q22 14 22 18 M14 2 L14 22"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <circle cx="14" cy="14" r="2.4" fill="currentColor" opacity="0.85" />
      <path
        d="M30 6 L36 6 M6 30 L6 36"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </svg>
  );
}

function Seal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="78" stroke="var(--crimson)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="72" stroke="var(--crimson)" strokeWidth="0.7" />
      <circle cx="100" cy="100" r="56" stroke="var(--gold-deep)" strokeWidth="0.6" />
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 360) / 36;
        return (
          <line
            key={i}
            x1="100"
            y1="28"
            x2="100"
            y2="34"
            stroke="var(--crimson)"
            strokeWidth="1"
            transform={`rotate(${a} 100 100)`}
          />
        );
      })}
      <path
        id="sealTop"
        d="M 40 100 A 60 60 0 0 1 160 100"
        fill="none"
      />
      <path
        id="sealBot"
        d="M 40 100 A 60 60 0 0 0 160 100"
        fill="none"
      />
      <text
        fill="var(--crimson-deep)"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.35em", fontSize: "11px" }}
      >
        <textPath href="#sealTop" startOffset="50%" textAnchor="middle">
          GRANT WRITING USA
        </textPath>
      </text>
      <text
        fill="var(--crimson-deep)"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.45em", fontSize: "8px" }}
      >
        <textPath href="#sealBot" startOffset="50%" textAnchor="middle">
          EST. PROFESSIONAL EDUCATION
        </textPath>
      </text>
      <g transform="translate(100 100)">
        <text
          textAnchor="middle"
          dy="-2"
          fill="var(--crimson-deep)"
          style={{ fontFamily: "var(--font-script)", fontSize: "32px" }}
        >
          GW
        </text>
        <text
          textAnchor="middle"
          dy="18"
          fill="var(--navy)"
          style={{ fontFamily: "var(--font-sans)", fontSize: "7px", letterSpacing: "0.3em", fontWeight: 600 }}
        >
          USA
        </text>
      </g>
    </svg>
  );
}
