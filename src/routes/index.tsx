import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Award, Upload, Download, Trash2, LoaderCircle, ImagePlus, Check, FileText, Building2, UserRound, PenLine } from "lucide-react";
import { Certificate } from "@/components/Certificate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { prepareLogo } from "@/lib/logo-processing";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "Certificate Studio — Create Your Certificate" },
    { name: "description", content: "Create a personalized certificate with your logo, signature, recipient details, and an elegant print-ready PDF." },
    { property: "og:title", content: "Certificate Studio — Create Your Certificate" },
    { property: "og:description", content: "Personalized, beautifully crafted certificates for any organization." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function Index() {
  const [organization, setOrganization] = useState("");
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [certificateType, setCertificateType] = useState("Completion");
  const [course, setCourse] = useState("");
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [logo, setLogo] = useState("");
  const [removeBackground, setRemoveBackground] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [scale, setScale] = useState(0.6);
  const certRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setDate(new Date().toLocaleDateString('en-CA')); }, []);
  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => { if (entry) setScale(entry.contentRect.width / 1100); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let active = true;
    if (!file) { setLogo(''); setProcessing(false); return; }
    setProcessing(true);
    setError('');
    prepareLogo(file, removeBackground).then(result => { if (active) setLogo(result); }).catch(err => { if (active) { setError(err instanceof Error ? err.message : 'Could not process your logo.'); setLogo(''); } }).finally(() => { if (active) setProcessing(false); });
    return () => { active = false; };
  }, [file, removeBackground]);
  const formattedDate = useMemo(() => {
    if (!date) return '';
    const d = new Date(`${date}T12:00:00`);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [date]);
  const certificateId = useMemo(() => {
    let hash = 0;
    for (const char of `${organization}-${name}-${course}-${date}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return `CS-${date.slice(0, 4) || '0000'}-${(hash % 100000).toString().padStart(5, '0')}`;
  }, [organization, name, course, date]);
  async function handleDownload() {
    const certificate = certRef.current;
    if (!certificate) return;
    setGenerating(true); setError(''); setStatus('');
    try {
      await document.fonts.ready;
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(certificate, { scale: 2, width: 1100, height: 850, backgroundColor: null, useCORS: true,
        onclone: (doc) => {
          const paper = doc.querySelector<HTMLElement>('.cert-paper');
          if (!paper) return;
          const wrapper = paper.parentElement;
          if (wrapper) { wrapper.style.transform = 'none'; wrapper.style.position = 'static'; }
          paper.style.boxShadow = 'none';
        },
      });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: 'letter' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 11, 8.5);
      pdf.save(`Certificate_${(name || 'Recipient').replace(/[^a-z0-9-]/gi, '_')}.pdf`);
      setStatus('Your certificate has been downloaded.');
    } catch { setError('The PDF could not be created. Please try again.'); }
    finally { setGenerating(false); }
  }
  return <div className="min-h-screen bg-background">
    <header className="studio-header"><div className="studio-header-inner"><a href="/" className="studio-brand"><span className="brand-icon"><Award size={22} /></span><span>Certificate <strong>Studio</strong></span></a><span className="header-detail"><span className="status-dot" /> Made to recognize achievement</span></div></header>
    <main className="studio-main">
      <div className="page-heading"><div><p className="section-eyebrow">A little recognition. A lasting impression.</p><h1>Create a certificate</h1></div><span className="document-label"><FileText size={16} /> Letter · Landscape</span></div>
      <div className="studio-layout">
        <aside className="studio-form">
          <FormSection number="01" title="Your organization" icon={<Building2 size={17} />}>
            <Field id="organization" label="Organization name"><Input id="organization" value={organization} maxLength={80} onChange={e => setOrganization(e.target.value)} placeholder="Your organization" /></Field>
            <div className="logo-upload">
              <input ref={uploadRef} id="logo-upload" className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => { setFile(e.target.files?.[0] || null); e.target.value = ''; }} />
              <Button variant="ghost" className="upload-button" disabled={processing} onClick={() => uploadRef.current?.click()}>
                {processing ? <LoaderCircle className="animate-spin" /> : logo ? <img src={logo} alt="Uploaded logo" className="uploaded-thumbnail" /> : <ImagePlus />}
                <span><strong>{file ? file.name : 'Upload your logo'}</strong><small>{processing ? 'Processing image…' : 'PNG, JPG, WebP, GIF · Up to 10 MB'}</small></span><Upload />
              </Button>
              {file && <Button variant="ghost" size="icon" aria-label="Remove logo" title="Remove logo" onClick={() => setFile(null)}><Trash2 /></Button>}
            </div>
            <div className="flex items-start gap-2.5"><Checkbox id="remove-background" checked={removeBackground} onCheckedChange={value => setRemoveBackground(value === true)} /><Label htmlFor="remove-background" className="checkbox-label">Remove white or black background</Label></div>
            {logo && <Button variant="link" size="sm" className="px-0" asChild><a href={logo} download="organization-logo.png"><Download /> Download PNG logo</a></Button>}
          </FormSection>
          <FormSection number="02" title="The achievement" icon={<Award size={17} />}>
            <Field id="certificate-type" label="Certificate type"><Input id="certificate-type" value={certificateType} maxLength={40} onChange={e => setCertificateType(e.target.value)} placeholder="Completion, Achievement, Appreciation…" /></Field>
            <Field id="course" label="Workshop / program"><Input id="course" value={course} maxLength={100} onChange={e => setCourse(e.target.value)} placeholder="Professional Development Workshop" /></Field>
            <div className="course-presets">{['Grant Writing', 'Grant Management', 'Subaward'].map(type => <Button key={type} variant="outline" size="sm" onClick={() => setCourse(`${type} Workshop`)} className={course === `${type} Workshop` ? 'preset-active' : ''}>{type}</Button>)}</div>
          </FormSection>
          <FormSection number="03" title="The recipient" icon={<UserRound size={17} />}>
            <Field id="recipient" label="Recipient name" required><Input id="recipient" value={name} maxLength={90} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" autoComplete="name" /></Field>
            <Field id="agency" label="Agency / organization"><Input id="agency" value={agency} maxLength={100} onChange={e => setAgency(e.target.value)} placeholder="Agency or department" /></Field>
            <Field id="email" label="Email"><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@organization.com" autoComplete="email" /></Field>
            <div className="grid grid-cols-2 gap-3"><Field id="city" label="City"><Input id="city" value={city} maxLength={60} onChange={e => setCity(e.target.value)} placeholder="Denver, CO" /></Field><Field id="date" label="Completion date"><Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} /></Field></div>
          </FormSection>
          <FormSection number="04" title="The signature" icon={<PenLine size={17} />}>
            <Field id="signer" label="Signer's name"><Input id="signer" value={signerName} maxLength={70} onChange={e => setSignerName(e.target.value)} placeholder="Jordan Taylor" /></Field>
            <Field id="signer-title" label="Signer's title"><Input id="signer-title" value={signerTitle} maxLength={70} onChange={e => setSignerTitle(e.target.value)} placeholder="Chief Executive Officer" /></Field>
          </FormSection>
        </aside>
        <section className="preview-section" aria-label="Certificate preview">
          <div className="preview-toolbar"><span><span className="status-dot" /> Live preview</span><span className="preview-number">{certificateId}</span></div>
          <div className="preview-stage"><div ref={previewRef} className="preview-sizing" style={{ aspectRatio: '1100 / 850' }}><div className="preview-scale" style={{ transform: `scale(${scale})` }}><Certificate ref={certRef} name={name} agency={agency} organization={organization} logo={logo} certificateType={certificateType} course={course} signerName={signerName} signerTitle={signerTitle} city={city} date={formattedDate} certificateId={certificateId} /></div></div></div>
          <div className="preview-bottom"><span><Check size={15} /> Print-ready PDF</span><span>11 × 8.5 in</span></div>
          <div className="download-area"><Button size="lg" disabled={generating || processing || !name.trim()} onClick={handleDownload} className="download-button">{generating ? <LoaderCircle className="animate-spin" /> : <Download />}{generating ? 'Preparing certificate…' : 'Download certificate'}</Button><p>PDF download only · Email is not sent</p></div>
          {error && <p role="alert" className="feedback-error">{error}</p>}{status && <p role="status" className="feedback-success">{status}</p>}
        </section>
      </div>
    </main>
    <footer className="studio-footer"><Award size={15} /> Certificate Studio <span>Every achievement deserves recognition.</span></footer>
  </div>;
}
function Field({ id, label, children, required }: { id: string; label: string; children: React.ReactNode; required?: boolean }) {
  return <div className="field"><Label htmlFor={id}>{label}{required && <span className="text-primary"> *</span>}</Label>{children}</div>;
}
function FormSection({ number, title, icon, children }: { number: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="form-section"><h2><span className="section-number">{number}</span>{title}<span className="section-icon">{icon}</span></h2><div className="space-y-4">{children}</div></section>;
}
