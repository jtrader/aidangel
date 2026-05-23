import jsPDF from "jspdf";

export function generateCertificatePdf(opts: {
  learnerName: string;
  courseTitle: string;
  certificateNumber: string;
  issuedAt: string | Date;
}) {
  const { learnerName, courseTitle, certificateNumber, issuedAt } = opts;
  const date = new Date(issuedAt);
  const dateStr = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(247, 247, 247);
  pdf.rect(0, 0, W, H, "F");

  // Outer border
  pdf.setDrawColor(220, 38, 38); // brand red
  pdf.setLineWidth(6);
  pdf.rect(28, 28, W - 56, H - 56);
  pdf.setLineWidth(1);
  pdf.rect(40, 40, W - 80, H - 80);

  // Header
  pdf.setTextColor(220, 38, 38);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("FIRST AID ANGEL", W / 2, 90, { align: "center" });
  pdf.setFontSize(10);
  pdf.setTextColor(120, 120, 120);
  pdf.text("Love Key Emergency & Recovery Network", W / 2, 108, { align: "center" });

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(30, 30, 30);
  pdf.text("Certificate of Completion", W / 2, 180, { align: "center" });

  // Awarded to
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text("This certifies that", W / 2, 230, { align: "center" });

  // Name
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(36);
  pdf.setTextColor(220, 38, 38);
  pdf.text(learnerName, W / 2, 285, { align: "center" });

  // Decorative line under name
  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(1.5);
  const lineY = 305;
  pdf.line(W / 2 - 200, lineY, W / 2 + 200, lineY);

  // Course
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text("has successfully completed the online course", W / 2, 340, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(30, 30, 30);
  pdf.text(courseTitle, W / 2, 380, { align: "center" });

  // Footer
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Date issued: ${dateStr}`, W / 2 - 200, H - 90, { align: "left" });
  pdf.text(`Certificate No: ${certificateNumber}`, W / 2 + 200, H - 90, { align: "right" });

  pdf.setFontSize(9);
  pdf.setTextColor(140, 140, 140);
  pdf.text(
    `Verify at firstaidangel.org/verify/${certificateNumber}`,
    W / 2,
    H - 70,
    { align: "center" }
  );

  // Disclaimer
  pdf.setFontSize(8);
  pdf.text(
    "This certificate confirms completion of online theory only and is not a substitute for accredited in-person first aid training.",
    W / 2,
    H - 55,
    { align: "center" }
  );

  pdf.save(`FirstAidAngel-Certificate-${certificateNumber}.pdf`);
}
