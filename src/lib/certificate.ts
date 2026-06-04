import jsPDF from "jspdf";
import faaLogoUrl from "@/assets/aidangel-logo.png";

function hexToRgb(hex?: string | null): [number, number, number] | null {
  if (!hex) return null;
  const m = hex.trim().replace("#", "");
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(m)) return null;
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

async function loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; w: number; h: number; format: "PNG" | "JPEG" } | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = dataUrl;
    });
    const format = blob.type.includes("png") ? "PNG" : "JPEG";
    return { dataUrl, w: img.width, h: img.height, format };
  } catch {
    return null;
  }
}

export async function generateCertificatePdf(opts: {
  learnerName: string;
  courseTitle: string;
  certificateNumber: string;
  issuedAt: string | Date;
  org?: { name: string; logoUrl?: string | null; primaryColor?: string | null } | null;
}) {
  const { learnerName, courseTitle, certificateNumber, issuedAt, org } = opts;
  const date = new Date(issuedAt);
  const dateStr = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const brand = hexToRgb(org?.primaryColor) ?? [220, 38, 38];

  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(247, 247, 247);
  pdf.rect(0, 0, W, H, "F");

  // Outer border
  pdf.setDrawColor(brand[0], brand[1], brand[2]);
  pdf.setLineWidth(6);
  pdf.rect(28, 28, W - 56, H - 56);
  pdf.setLineWidth(1);
  pdf.rect(40, 40, W - 80, H - 80);

  // Org logo (top-left) + name (top-right) when an org is provided
  if (org?.logoUrl) {
    const img = await loadImageAsDataUrl(org.logoUrl);
    if (img) {
      const maxH = 56;
      const ratio = img.w / img.h;
      const h = maxH;
      const w = Math.min(maxH * ratio, 140);
      pdf.addImage(img.dataUrl, img.format, 64, 64, w, h);
    }
  }
  if (org?.name) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Issued for ${org.name}`, W - 64, 88, { align: "right" });
  }

  // First Aid Angel logo (top-center)
  const faaLogo = await loadImageAsDataUrl(faaLogoUrl);
  if (faaLogo) {
    const logoH = 64;
    const logoW = logoH * (faaLogo.w / faaLogo.h);
    pdf.addImage(faaLogo.dataUrl, faaLogo.format, W / 2 - logoW / 2, 70, logoW, logoH);
  }

  // Header
  pdf.setTextColor(brand[0], brand[1], brand[2]);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("FIRST AID ANGEL", W / 2, 156, { align: "center" });

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(30, 30, 30);
  pdf.text("Certificate of Completion", W / 2, 215, { align: "center" });

  // Awarded to
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text("This certifies that", W / 2, 255, { align: "center" });

  // Name
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(36);
  pdf.setTextColor(brand[0], brand[1], brand[2]);
  pdf.text(learnerName, W / 2, 305, { align: "center" });

  // Decorative line under name
  pdf.setDrawColor(brand[0], brand[1], brand[2]);
  pdf.setLineWidth(1.5);
  const lineY = 325;
  pdf.line(W / 2 - 200, lineY, W / 2 + 200, lineY);

  // Course
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text("has successfully completed the online course", W / 2, 360, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(30, 30, 30);
  pdf.text(courseTitle, W / 2, 400, { align: "center" });

  // Footer
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Date issued: ${dateStr}`, W / 2 - 200, H - 90, { align: "left" });
  pdf.text(`Certificate No: ${certificateNumber}`, W / 2 + 200, H - 90, { align: "right" });

  pdf.setFontSize(9);
  pdf.setTextColor(140, 140, 140);
  pdf.text(`Verify at firstaidangel.org/verify/${certificateNumber}`, W / 2, H - 70, { align: "center" });

  pdf.setFontSize(8);
  pdf.text(
    "This certificate confirms completion of online theory only and is not a substitute for accredited in-person first aid training.",
    W / 2, H - 55, { align: "center" }
  );

  pdf.save(`FirstAidAngel-Certificate-${certificateNumber}.pdf`);
}
