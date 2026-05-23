#!/usr/bin/env python3
"""Generate one A4 'Angel Action' PDF per KB topic from kb/*.md.

Output goes to public/angel-action/{slug}.pdf so the files are served as
static assets and can be linked from KB pages with simple <a download> tags.
"""
import json
import os
import re
from pathlib import Path

from reportlab.lib.colors import HexColor, black
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parent.parent
KB_DIR = ROOT / "kb"
OUT_DIR = ROOT / "public" / "angel-action"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BRAND_RED = HexColor("#DC2626")
BRAND_BG = HexColor("#F7F7F7")
MUTED = HexColor("#555555")
DARK = HexColor("#111111")

styles = getSampleStyleSheet()

styles_kicker = ParagraphStyle(
    "Kicker", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=9, textColor=BRAND_RED,
    spaceAfter=4, leading=11,
)
styles_h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=26, textColor=DARK,
    spaceAfter=8, leading=30,
)
styles_summary = ParagraphStyle(
    "Summary", parent=styles["Normal"],
    fontName="Helvetica", fontSize=11, textColor=MUTED,
    spaceAfter=14, leading=15,
)
styles_h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=14, textColor=BRAND_RED,
    spaceBefore=14, spaceAfter=6, leading=18,
)
styles_h3 = ParagraphStyle(
    "H3", parent=styles["Heading3"],
    fontName="Helvetica-Bold", fontSize=11.5, textColor=DARK,
    spaceBefore=10, spaceAfter=4, leading=14,
)
styles_body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10.5, textColor=DARK,
    spaceAfter=6, leading=15, alignment=TA_LEFT,
)
styles_li = ParagraphStyle(
    "Li", parent=styles_body, spaceAfter=2,
)
styles_footer = ParagraphStyle(
    "Footer", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=8, textColor=MUTED, leading=10,
)


def md_inline_to_rl(text: str) -> str:
    """Convert a subset of inline markdown to ReportLab mini-HTML."""
    # Escape angle brackets / ampersands first.
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # Bold **x** and __x__
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"__(.+?)__", r"<b>\1</b>", text)
    # Italic *x* and _x_
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<i>\1</i>", text)
    text = re.sub(r"(?<!_)_(?!_)(.+?)(?<!_)_(?!_)", r"<i>\1</i>", text)
    # Inline code `x`
    text = re.sub(r"`([^`]+)`", r'<font face="Courier">\1</font>', text)
    # Links [label](href) — show just the label, bold and red.
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<font color="#DC2626"><b>{m.group(1)}</b></font>',
        text,
    )
    return text


def parse_markdown(body: str):
    """Yield Flowables from a markdown body. Handles #/##/###, lists, paragraphs."""
    lines = body.splitlines()
    i = 0
    out = []
    while i < len(lines):
        raw = lines[i].rstrip()
        line = raw.strip()
        if not line:
            i += 1
            continue

        # Headings
        if line.startswith("### "):
            out.append(Paragraph(md_inline_to_rl(line[4:].strip()), styles_h3))
            i += 1
            continue
        if line.startswith("## "):
            out.append(Paragraph(md_inline_to_rl(line[3:].strip()), styles_h2))
            i += 1
            continue
        if line.startswith("# "):
            # The first-level title is rendered separately; skip duplicates.
            i += 1
            continue

        # Ordered list
        m_ol = re.match(r"^\d+\.\s+(.*)", line)
        if m_ol:
            items = []
            while i < len(lines):
                cur = lines[i].strip()
                m = re.match(r"^\d+\.\s+(.*)", cur)
                if not m:
                    break
                items.append(ListItem(
                    Paragraph(md_inline_to_rl(m.group(1)), styles_li),
                    leftIndent=14,
                ))
                i += 1
            out.append(ListFlowable(
                items, bulletType="1",
                bulletFormat="%s.", bulletFontName="Helvetica-Bold",
                bulletColor=BRAND_RED, leftIndent=18, bulletFontSize=10.5,
            ))
            out.append(Spacer(1, 4))
            continue

        # Unordered list
        if line.startswith("- ") or line.startswith("* "):
            items = []
            while i < len(lines):
                cur = lines[i].strip()
                if not (cur.startswith("- ") or cur.startswith("* ")):
                    break
                items.append(ListItem(
                    Paragraph(md_inline_to_rl(cur[2:]), styles_li),
                    leftIndent=12,
                ))
                i += 1
            out.append(ListFlowable(
                items, bulletType="bullet",
                start="•", bulletColor=BRAND_RED, leftIndent=14,
            ))
            out.append(Spacer(1, 4))
            continue

        # Paragraph (collect until blank line / new block)
        para = [line]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if (not nxt or nxt.startswith("#") or nxt.startswith("- ")
                    or nxt.startswith("* ") or re.match(r"^\d+\.\s+", nxt)):
                break
            para.append(nxt)
            i += 1
        out.append(Paragraph(md_inline_to_rl(" ".join(para)), styles_body))
    return out


def header_footer(canvas, doc, topic):
    canvas.saveState()
    # Top red bar
    canvas.setFillColor(BRAND_RED)
    canvas.rect(0, A4[1] - 12 * mm, A4[0], 12 * mm, fill=1, stroke=0)
    # Brand text on bar
    canvas.setFillColor(HexColor("#FFFFFF"))
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(15 * mm, A4[1] - 8.2 * mm, "✚  FIRST AID ANGEL  ·  ANGEL ACTION CARD")
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(A4[0] - 15 * mm, A4[1] - 8.2 * mm, topic["category"].upper())
    # Footer
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica-Oblique", 8)
    canvas.drawString(
        15 * mm, 10 * mm,
        "In an emergency call 000. For learning and refresher use — not a substitute for professional medical care.",
    )
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(A4[0] - 15 * mm, 10 * mm, f"firstaidangel.org  ·  page {doc.page}")
    canvas.restoreState()


def build_pdf(topic, body_md: str, out_path: Path):
    doc = SimpleDocTemplate(
        str(out_path), pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=22 * mm, bottomMargin=18 * mm,
        title=f"{topic['title']} · Angel Action Card",
        author="First Aid Angel",
        subject=topic["summary"],
    )

    story = []
    story.append(Paragraph(f"ANGEL ACTION · {topic['category'].upper()}", styles_kicker))
    story.append(Paragraph(topic["title"], styles_h1))
    story.append(Paragraph(topic["summary"], styles_summary))
    story.append(HRFlowable(width="100%", thickness=1, color=BRAND_RED, spaceAfter=10))
    story.extend(parse_markdown(body_md))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#DDDDDD"), spaceAfter=6))
    story.append(Paragraph(
        "Adapted from <b>Australian First Aid 5th Edition</b>. "
        "Get the full guide and live CPR metronome at <b>firstaidangel.org</b>.",
        styles_footer,
    ))

    doc.build(
        story,
        onFirstPage=lambda c, d: header_footer(c, d, topic),
        onLaterPages=lambda c, d: header_footer(c, d, topic),
    )


def main():
    meta = json.loads((KB_DIR / "_meta.json").read_text())
    manifest = []
    for topic in meta:
        slug = topic["slug"]
        md_path = KB_DIR / f"{slug}.md"
        if not md_path.exists():
            print(f"skip {slug}: no markdown")
            continue
        body = md_path.read_text()
        # Strip the first H1 — we render the title ourselves.
        body = re.sub(r"^#\s+.*\n+", "", body, count=1)
        # Strip the leading summary paragraph if it duplicates the meta summary.
        summary_norm = re.sub(r"\s+", " ", topic["summary"]).strip()
        first_para_match = re.match(r"\s*([^\n][^\n]*(?:\n(?!\n)[^\n]+)*)\n*", body)
        if first_para_match:
            first_para = re.sub(r"\s+", " ", first_para_match.group(1)).strip()
            if first_para == summary_norm:
                body = body[first_para_match.end():]
        out_path = OUT_DIR / f"{slug}.pdf"
        build_pdf(topic, body, out_path)
        size_kb = out_path.stat().st_size // 1024
        print(f"✓ {slug}.pdf ({size_kb} KB)")
        manifest.append({"slug": slug, "title": topic["title"], "size_kb": size_kb})

    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(f"\nGenerated {len(manifest)} PDFs → {OUT_DIR}")


if __name__ == "__main__":
    main()
