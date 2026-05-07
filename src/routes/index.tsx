import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Certificate, type WorkshopType } from "@/components/Certificate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import logo from "@/assets/grant-writing-usa-logo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Grant Writing USA — Certificate of Completion" },
      {
        name: "description",
        content:
          "Generate official Grant Writing USA workshop certificates of completion for Grant Writing, Grant Management, and Subaward classes.",
      },
    ],
  }),
});

const WORKSHOPS: WorkshopType[] = ["Grant Writing", "Grant Management", "Subaward"];

function Index() {
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [workshop, setWorkshop] = useState<WorkshopType>("Grant Writing");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [generating, setGenerating] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const formattedDate = useMemo(() => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }, [date]);

  const certificateId = useMemo(() => {
    const seed = `${name}-${workshop}-${date}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return `GWU-${new Date(date).getFullYear() || "----"}-${(hash % 99999).toString().padStart(5, "0")}`;
  }, [name, workshop, date]);

  async function handleDownload() {
    if (!certRef.current) return;
    setGenerating(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#fbf7ec",
        useCORS: true,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "in", format: "letter" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(img, "PNG", 0, 0, pageW, pageH);
      const safeName = (name || "certificate").replace(/\s+/g, "_");
      pdf.save(`GrantWritingUSA_${workshop.replace(/\s+/g, "")}_${safeName}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Grant Writing USA" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-[var(--navy)]">
                Certificate Studio
              </p>
              <p className="text-xs text-muted-foreground">Workshop Completion Certificates</p>
            </div>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Internal Tool · v1.0
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[360px_1fr]">
        {/* Form */}
        <aside className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              Issue a Certificate
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in the attendee details. The certificate updates live. Download a print-ready
              PDF when you&rsquo;re ready.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--navy)]">
              Workshop
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {WORKSHOPS.map((w) => {
                const active = workshop === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWorkshop(w)}
                    className={`group flex items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                      active
                        ? "border-[var(--crimson)] bg-[var(--crimson)]/5 ring-2 ring-[var(--crimson)]/20"
                        : "border-border bg-background hover:border-[var(--crimson)]/40"
                    }`}
                  >
                    <div>
                      <div className="font-display text-base font-semibold text-foreground">
                        {w}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {w === "Subaward" ? "1-day · 8 contact hours" : "2-day · 16 contact hours"}
                      </div>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        active ? "bg-[var(--crimson)]" : "bg-border group-hover:bg-[var(--crimson)]/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <Field label="Attendee Name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane A. Doe"
              />
            </Field>
            <Field label="Agency / Organization">
              <Input
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="Department of Health & Human Services"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@agency.gov"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Workshop City">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Denver, CO"
                />
              </Field>
              <Field label="Date">
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleDownload}
              disabled={generating || !name}
              className="h-12 w-full bg-[var(--crimson)] text-base font-semibold tracking-wide text-white hover:bg-[var(--crimson-deep)]"
            >
              {generating ? "Preparing PDF…" : "Download PDF Certificate"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              In production this will render the PDF server-side and email it to{" "}
              <span className="font-medium text-foreground">{email || "the attendee"}</span>.
            </p>
          </div>
        </aside>

        {/* Preview */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Live Preview
            </p>
            <p className="text-xs text-muted-foreground">
              Cert No. <span className="font-mono text-foreground">{certificateId}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[var(--navy)]/8 to-[var(--crimson)]/5 p-6">
            <Certificate
              ref={certRef}
              name={name}
              agency={agency}
              workshop={workshop}
              city={city}
              date={formattedDate}
              certificateId={certificateId}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--navy)]/80">
        {label}
      </Label>
      {children}
    </div>
  );
}
