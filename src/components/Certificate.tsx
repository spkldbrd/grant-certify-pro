import { forwardRef, useId } from "react";

export type WorkshopType = "Grant Writing" | "Grant Management" | "Subaward";
export interface CertificateProps {
  name: string;
  agency: string;
  organization: string;
  logo?: string;
  certificateType: string;
  course: string;
  signerName: string;
  signerTitle: string;
  city: string;
  date: string;
  certificateId: string;
}

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ name, agency, organization, logo, certificateType, course, signerName, signerTitle, city, date, certificateId }, ref) => (
    <div ref={ref} className="cert-paper">
      <div className="cert-border cert-border-outer" />
      <div className="cert-border cert-border-inner" />
      {(["tl", "tr", "bl", "br"] as const).map((corner) => <CornerOrnament key={corner} corner={corner} />)}
      <div className="cert-header">
        {logo ? <img src={logo} alt={organization || "Organization logo"} className="cert-logo" /> : <div className="cert-monogram">{(organization || "Your Organization").split(' ').map(word => word[0]).slice(0, 3).join('')}</div>}
        <p className="cert-organization">{organization || "Your Organization"}</p>
      </div>
      <div className="cert-heading">
        <p className="cert-eyebrow">Certificate of</p>
        <h2>{certificateType.replace(/^certificate of\s*/i, '') || "Completion"}</h2>
        <div className="cert-divider"><span />◆<span /></div>
        <p className="cert-eyebrow">Proudly presented to</p>
      </div>
      <div className="cert-recipient">
        <h1 className={name.length > 36 ? 'cert-name cert-name-long' : 'cert-name'}>{name || "Recipient Name"}</h1>
        <div className="cert-name-rule" />
        <p className="cert-agency">{agency || '\u00a0'}</p>
      </div>
      <div className="cert-body">
        <p>In recognition of the successful completion of</p>
        <h3>{course || "Professional Development Workshop"}</h3>
        <p>with dedication to learning and professional excellence.</p>
      </div>
      <div className="cert-footer">
        <div className="cert-signoff"><p className="cert-date">{date || "Date of Completion"}</p><div className="cert-signoff-rule" /><p className="cert-label">Date of completion</p>{city && <p className="cert-location">{city}</p>}</div>
        <Seal organization={organization} certificateType={certificateType} />
        <div className="cert-signoff"><p className={signerName.length > 26 ? 'cert-signature cert-signature-long' : 'cert-signature'}>{signerName || "Your Signature"}</p><div className="cert-signoff-rule" /><p className="cert-label">{signerName || "Authorized Signatory"}</p><p className="cert-location">{signerTitle || "Title"}</p></div>
      </div>
      <p className="cert-number">Certificate No. {certificateId}</p>
    </div>
  ),
);
Certificate.displayName = "Certificate";

function CornerOrnament({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  return <svg className={`cert-corner cert-corner-${corner}`} width="76" height="76" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M2 42V2H42 M10 32V10H32 M18 2V24H2 M2 18H24V2" stroke="currentColor" strokeWidth="1.2" /><path d="M30 10L36 16L30 22L24 16Z" fill="currentColor" /><circle cx="10" cy="10" r="2" fill="currentColor" /></svg>;
}
function Seal({ organization, certificateType }: { organization: string; certificateType: string }) {
  const id = useId().replace(/:/g, '');
  const type = certificateType.replace(/^certificate of\s*/i, '') || "Completion";
  return <svg className="cert-seal" viewBox="0 0 200 200" fill="none" role="img" aria-label={`${type} seal`}>
    <circle cx="100" cy="100" r="89" className="seal-fill" />
    <circle cx="100" cy="100" r="81" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.6" />
    <circle cx="100" cy="100" r="54" stroke="currentColor" strokeWidth="0.6" />
    {Array.from({ length: 48 }, (_, i) => <line key={i} x1="100" y1="14" x2="100" y2="19" stroke="currentColor" transform={`rotate(${i * 7.5} 100 100)`} />)}
    <path id={`${id}-top`} d="M 39 103 A 61 61 0 0 1 161 103" />
    <path id={`${id}-bottom`} d="M 39 103 A 61 61 0 0 0 161 103" />
    <text className="seal-arc"><textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle" textLength="165" lengthAdjust="spacingAndGlyphs">{(organization || "YOUR ORGANIZATION").toUpperCase()}</textPath></text>
    <text className="seal-arc"><textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">OFFICIAL CERTIFICATE</textPath></text>
    <text x="100" y="87" textAnchor="middle" className="seal-star">✦</text>
    <text x="100" y="110" textAnchor="middle" className="seal-type" textLength={type.length > 12 ? 93 : undefined} lengthAdjust="spacingAndGlyphs">{type.toUpperCase()}</text>
    <text x="100" y="133" textAnchor="middle" className="seal-star">✦</text>
  </svg>;
}
