#!/usr/bin/env python3
"""Generate speaker + session markdown from a Sessionize "accepted sessions" export.

Usage:
    python3 scripts/import-sessionize.py "<export>.xlsx" [--skip-photos]

The workbook must contain the two sheets Sessionize exports: "Accepted sessions"
and "Accepted speakers". Existing files under content/speakers and
content/sessions are overwritten, so hand-edits to generated files are lost —
re-run the import, then re-apply edits, or drop the file from SESSION_SLUGS.

Speaker photos are downloaded from the Sessionize CDN into
public/images/speakers/ so the site never hot-links a third-party host
(next.config.mjs deliberately allow-lists no CDN patterns).

Standard library only — this is a one-off importer, not part of the build.
"""

from __future__ import annotations

import argparse
import datetime as dt
import pathlib
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
import zipfile
from xml.etree import ElementTree as ET

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
ROOT = pathlib.Path(__file__).resolve().parent.parent
SPEAKER_DIR = ROOT / "content" / "speakers"
SESSION_DIR = ROOT / "content" / "sessions"
PHOTO_DIR = ROOT / "public" / "images" / "speakers"

# Readable URLs beat auto-truncated titles. Keyed by Sessionize session id so
# slugs survive title edits.
SESSION_SLUGS = {
    "1281262": "sovereignty-control-plane-patterns",
    "1281431": "cloud-native-cooperative-amul-ai-trust",
    "1285572": "scaling-llm-inference-kv-cache-routing",
    "1286929": "opencost-understanding-kubernetes-costs",
    "1271049": "platform-as-a-product-slos",
    "1286105": "kubernetes-universal-gpu-control-plane",
    "1283048": "breaking-charts-maintaining-valkey-helm",
    "1286880": "dandiya-defense-poisoned-prompts",
    "1281375": "securing-ai-owasp-top-10-llm",
    "1286435": "tracing-ai-agents-prompt-to-postgresql",
    "1287099": "zero-trust-for-ai",
    "1256022": "database-was-alive-five-minutes-ago",
    "1269928": "kubevirtbmc-bare-metal-provisioning",
    "1286952": "beyond-dom-parsing-webmcp",
    "1287033": "pod-security-end-to-end",
    "1286964": "breaking-rag-apart-microservices-blueprint",
    "1287097": "real-problems-contributors-face",
    "1280738": "four-default-settings-cluster-compromise",
    "1286910": "monitoring-cert-manager",
    "1286667": "one-bad-label-cardinality-explosion",
    "1287042": "istio-consistent-hashing-webrtc",
    "1285396": "dbaas-on-kubernetes-mistakes",
}

# Sessionize has no keynote format — the organisers promote accepted talks to
# keynotes after scheduling, so the type is set here rather than in the export.
SESSION_TYPE_OVERRIDES = {
    "1281262": "Keynote",
    "1281431": "Keynote",
}

# Sessionize name fields carry placeholders and duplicated surnames.
NAME_OVERRIDES = {
    "Shivam (anirudh) Nandy": "Shivam Nandy",
    "Amritansh Amritansh": "Amritansh",
    "Darshil N/A": "Darshil",
    "Vignesh Muthu.S": "Vignesh Muthu S",
    "Sarvani swapna priya Yallapragada": "Sarvani Swapna Priya Yallapragada",
}

# Typos and spelling variants that arrive in the "Open Source Projects Used" cell.
TAG_ALIASES = {
    "kuberentes": "kubernetes",
    "kubernets": "kubernetes",
    "opentelementry": "opentelemetry",
    "open-telemetry": "opentelemetry",
    "argocd": "argo-cd",
    "certmanager": "cert-manager",
    "operatorsdk": "operator-sdk",
    "redhat": "red-hat",
}

TYPE_BY_FORMAT = {"lightning talk": "Lightning", "panel": "Panel"}
# The event runs no workshop track, so there is no session type to map one onto —
# refuse the row rather than quietly filing it as a talk.
UNSUPPORTED_FORMATS = ("workshop",)
LEVELS = {"any": "All levels", "beginner": "Beginner", "intermediate": "Intermediate", "advanced": "Advanced"}
PLACEHOLDERS = {"", "n/a", "na", "none", "-"}
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
EXCEL_EPOCH = dt.datetime(1899, 12, 30)


# ── workbook reading ──────────────────────────────────────────────────────────


def read_sheets(path: pathlib.Path) -> dict[str, list[dict[str, str]]]:
    zf = zipfile.ZipFile(path)
    strings = [
        "".join(t.text or "" for t in si.iter(NS + "t"))
        for si in ET.fromstring(zf.read("xl/sharedStrings.xml")).findall(NS + "si")
    ]
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = {
        rel.get("Id"): rel.get("Target")
        for rel in ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    }
    sheets: dict[str, list[dict[str, str]]] = {}
    for sheet in workbook.iter(NS + "sheet"):
        rel_id = sheet.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target = rels[rel_id].lstrip("/")
        member = target if target.startswith("xl/") else f"xl/{target}"
        sheets[sheet.get("name")] = _rows_to_dicts(_read_rows(zf.read(member), strings))
    return sheets


def _read_rows(xml: bytes, strings: list[str]) -> list[list[str]]:
    rows: list[list[str]] = []
    for row in ET.fromstring(xml).findall(".//" + NS + "row"):
        cells: dict[int, str] = {}
        for cell in row.findall(NS + "c"):
            value = cell.find(NS + "v")
            if value is None:
                inline = cell.find(NS + "is")
                text = "".join(t.text or "" for t in inline.iter(NS + "t")) if inline is not None else ""
            elif cell.get("t") == "s":
                text = strings[int(value.text)]
            else:
                text = value.text or ""
            cells[_column_index(cell.get("r"))] = text
        rows.append([cells.get(i, "") for i in range(max(cells) + 1 if cells else 0)])
    return rows


def _column_index(ref: str) -> int:
    letters = "".join(ch for ch in ref if ch.isalpha())
    index = 0
    for ch in letters:
        index = index * 26 + ord(ch) - 64
    return index - 1


def _rows_to_dicts(rows: list[list[str]]) -> list[dict[str, str]]:
    header = rows[0]
    padded = (row + [""] * (len(header) - len(row)) for row in rows[1:])
    return [dict(zip(header, row)) for row in padded]


# ── field helpers ─────────────────────────────────────────────────────────────


def clean(value: str) -> str:
    # Sessionize encodes CRLF inside cells as a literal `_x000D_`.
    text = (value or "").replace("_x000D_", "\n").replace("\r\n", "\n").replace("\r", "\n")
    text = "\n".join(line.rstrip() for line in text.split("\n"))
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def field(value: str) -> str:
    text = clean(value)
    return "" if text.lower() in PLACEHOLDERS else text


def slugify(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", ascii_value.lower())).strip("-")


def quote(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def excel_datetime(serial: str) -> dt.datetime | None:
    if not serial:
        return None
    return (EXCEL_EPOCH + dt.timedelta(days=float(serial))).replace(tzinfo=IST)


def display_name(first: str, last: str) -> str:
    raw = " ".join(part for part in (clean(first), clean(last)) if part)
    raw = re.sub(r"\s+", " ", raw)
    if raw in NAME_OVERRIDES:
        return NAME_OVERRIDES[raw]
    return " ".join(word if word.isupper() else word[:1].upper() + word[1:] for word in raw.split())


def session_type(fmt: str, duration: int) -> str:
    lowered = fmt.lower()
    for needle in UNSUPPORTED_FORMATS:
        if needle in lowered:
            raise SystemExit(f"unsupported session format {fmt!r} — the site has no {needle} type")
    for needle, value in TYPE_BY_FORMAT.items():
        if needle in lowered:
            return value
    return "Lightning" if duration and duration <= 10 else "Talk"


def tags_from_projects(raw: str) -> list[str]:
    """Only accept short, clean project lists — several cells hold prose instead."""
    text = field(raw)
    if not text or ":" in text:
        return []
    # Qualifiers like "KServe (CNCF)" and list markers like "1." aren't part of the tag.
    parts = [
        re.sub(r"^[-*\d]+[.)]?\s*", "", re.sub(r"\([^)]*\)", "", p).strip()).strip(" .;")
        for chunk in text.split("\n")
        for p in chunk.split(",")
    ]
    parts = [p for p in parts if p and p.lower() not in PLACEHOLDERS]
    if not parts or len(parts) > 8 or any(len(p) > 28 or len(p.split()) > 3 for p in parts):
        return []
    tags: list[str] = []
    for part in parts:
        tag = TAG_ALIASES.get(slugify(part), slugify(part))
        if tag and tag not in tags:
            tags.append(tag)
    return tags[:8]


def frontmatter(fields: list[tuple[str, str]], body: str) -> str:
    lines = ["---", *(f"{key}:{f' {value}' if value else ''}" for key, value in fields), "---", ""]
    if body:
        lines += [body, ""]
    return "\n".join(lines)


# ── generation ────────────────────────────────────────────────────────────────


def build_speakers(rows: list[dict[str, str]]) -> dict[str, dict]:
    speakers: dict[str, dict] = {}
    used: set[str] = set()
    for row in rows:
        name = display_name(row["FirstName"], row["LastName"])
        slug = slugify(name)
        while slug in used:
            slug += "-2"
        used.add(slug)
        speakers[row["Speaker Id"].strip()] = {
            "slug": slug,
            "name": name,
            "role": field(row.get("Speaker Title", "")),
            "company": field(row.get("Company", "")),
            "bio": clean(row.get("Bio", "")),
            "linkedin": field(row.get("LinkedIn", "")),
            "twitter": field(row.get("X (Twitter)", "")),
            "website": field(row.get("Blog", "")),
            "photo": field(row.get("Profile Picture", "")),
            "sessions": [],
            "keynote": False,
        }
    return speakers


def build_sessions(rows: list[dict[str, str]], speakers: dict[str, dict]) -> list[dict]:
    sessions = []
    for row in rows:
        session_id = row["Session Id"].strip()
        slug = SESSION_SLUGS.get(session_id) or slugify(row["Title"])[:60].strip("-")
        duration = int(float(row["Scheduled Duration"] or 0))
        ids = [i.strip() for i in row.get("Speaker Ids", "").split(",") if i.strip()]
        missing = [i for i in ids if i not in speakers]
        if missing:
            raise SystemExit(f"Session {session_id} references unknown speaker ids: {missing}")
        slugs = [speakers[i]["slug"] for i in ids]
        session_kind = SESSION_TYPE_OVERRIDES.get(
            session_id, session_type(row["Session Format"], duration)
        )
        for speaker_slug, speaker_id in zip(slugs, ids):
            speakers[speaker_id]["sessions"].append(slug)
            # Keynote status is a property of the session, but the site
            # highlights the person — derive it here so a re-import can't drop
            # the flag the markdown carries.
            if session_kind == "Keynote":
                speakers[speaker_id]["keynote"] = True
        sessions.append(
            {
                "slug": slug,
                "title": clean(row["Title"]),
                "speakers": slugs,
                "track": clean(row["Track"]),
                "type": session_kind,
                "duration": duration,
                "start": excel_datetime(row["Scheduled At"]),
                "room": field(row.get("Room", "")),
                "level": LEVELS.get(clean(row.get("Audience Level", "")).lower(), ""),
                "tags": tags_from_projects(row.get("Open Source Projects Used", "")),
                "abstract": clean(row["Description"]),
            }
        )
    return sessions


def write_session(session: dict) -> None:
    fields = [
        ("title", quote(session["title"])),
        ("speakers", "[" + ", ".join(quote(s) for s in session["speakers"]) + "]"),
    ]
    if session["track"]:
        fields.append(("track", quote(session["track"])))
    fields.append(("type", quote(session["type"])))
    if session["duration"]:
        fields.append(("durationMinutes", str(session["duration"])))
    if session["start"]:
        fields.append(("start", quote(session["start"].isoformat())))
    if session["room"]:
        fields.append(("room", quote(session["room"])))
    if session["level"]:
        fields.append(("level", quote(session["level"])))
    if session["tags"]:
        fields.append(("tags", "[" + ", ".join(quote(t) for t in session["tags"]) + "]"))
    (SESSION_DIR / f"{session['slug']}.md").write_text(
        frontmatter(fields, session["abstract"]), encoding="utf8"
    )


def write_speaker(speaker: dict, photo: str) -> None:
    fields = [("name", quote(speaker["name"]))]
    if speaker["role"]:
        fields.append(("role", quote(speaker["role"])))
    if speaker["company"]:
        fields.append(("company", quote(speaker["company"])))
    if photo:
        fields.append(("photo", quote(photo)))
    socials = [(key, speaker[key]) for key in ("twitter", "linkedin", "website") if speaker[key]]
    if socials:
        fields.append(("socials", ""))
        fields += [(f"  {key}", quote(url)) for key, url in socials]
    if speaker["sessions"]:
        fields.append(("sessions", "[" + ", ".join(quote(s) for s in speaker["sessions"]) + "]"))
    if speaker["keynote"]:
        fields.append(("keynote", "true"))
    (SPEAKER_DIR / f"{speaker['slug']}.md").write_text(
        frontmatter(fields, speaker["bio"]), encoding="utf8"
    )


def download_photo(speaker: dict) -> str:
    url = speaker["photo"]
    if not url:
        return ""
    suffix = pathlib.Path(urllib.parse.urlparse(url).path).suffix.lower() or ".jpg"
    target = PHOTO_DIR / f"{speaker['slug']}{suffix}"
    if not target.exists():
        request = urllib.request.Request(url, headers={"User-Agent": "kcdgujarat-import"})
        with urllib.request.urlopen(request, timeout=30) as response:
            target.write_bytes(response.read())
    return f"/images/speakers/{target.name}"


def existing_photo(slug: str) -> str:
    """Keep whatever import-speaker-photos.mjs already wrote, hashed name and all."""
    pattern = re.compile(rf"{re.escape(slug)}(-[0-9a-f]{{8}})?")
    matches = sorted(p for p in PHOTO_DIR.glob(f"{slug}*") if pattern.fullmatch(p.stem))
    return f"/images/speakers/{matches[0].name}" if matches else ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=pathlib.Path)
    parser.add_argument("--skip-photos", action="store_true")
    args = parser.parse_args()

    sheets = read_sheets(args.workbook)
    speakers = build_speakers(sheets["Accepted speakers"])
    sessions = build_sessions(sheets["Accepted sessions"], speakers)

    SESSION_DIR.mkdir(parents=True, exist_ok=True)
    SPEAKER_DIR.mkdir(parents=True, exist_ok=True)
    PHOTO_DIR.mkdir(parents=True, exist_ok=True)

    for session in sessions:
        write_session(session)

    for speaker in speakers.values():
        photo = "" if args.skip_photos else download_photo(speaker)
        if not photo:
            photo = existing_photo(speaker["slug"])
        write_speaker(speaker, photo)

    unscheduled = [s["slug"] for s in sessions if not s["start"]]
    print(f"wrote {len(sessions)} sessions, {len(speakers)} speakers", file=sys.stderr)
    if unscheduled:
        print(f"warning: no scheduled time for {unscheduled}", file=sys.stderr)


if __name__ == "__main__":
    main()
