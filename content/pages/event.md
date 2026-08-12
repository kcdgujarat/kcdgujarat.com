---
# ─── Hero copy ───────────────────────────────────────────────────────────────
# Leave headline/subheadline blank to use the default generated text.
headline: ""
subheadline: "A community-driven, CNCF-backed Kubernetes Community Day for the cloud-native community in Ahmedabad, Gujarat. Call for Proposals are now closed."

# ─── Event details ────────────────────────────────────────────────────────────
# ISO 8601 date-times in IST (UTC+05:30). Used in the hero badge, schedule
# section, JSON-LD, and sitemap.
eventDate: "2026-09-19T07:30:00+05:30"
eventEndDate: "2026-09-19T18:00:00+05:30"

# City shown in the hero subheadline fallback and the coming-soon page.
city: "Ahmedabad, Gujarat"

# ─── Venue ────────────────────────────────────────────────────────────────────
venueName: ""
venueAddress: ""
# Paste a Google Maps embed src URL (the value inside the <iframe src="…">).
mapEmbedUrl: ""

# ─── Site contact (footer, coming-soon page) ──────────────────────────────────
contactEmail: "contact@kcdgujarat.com"

# Social profiles → edit content/pages/social.md (LinkedIn, X, Instagram, etc.)

# ─── Team section ─────────────────────────────────────────────────────────────
# - showTeam: false → hides home #team block, Team nav, footer link, and /team (default).
# - showTeam: true  → shows team preview on home, /team page, and nav links.
showTeam: true

# ─── Agenda: everything that is not a session ─────────────────────────────────
# Session blocks are derived from content/sessions, so they always match
# /schedule. List here only what no session describes — registration, breaks,
# sponsor slots, ceremonies. Both the homepage "Schedule overview" card and the
# /schedule page render this list, so the two can never disagree.
#
#   time     24-hour Asia/Kolkata start (required).
#   endTime  24-hour end. Omit for a marker with no length (e.g. Event Ends).
#   room     Set only when the item takes one hall while the other runs talks —
#            it then appears as a card beside that hall's session on /schedule.
#   glance   false keeps a minor item off the homepage summary card.
#   render   false hides the item everywhere.
timeline:
  - time: "07:30"
    endTime: "09:00"
    label: "Registration + Breakfast"
    icon: "☕"
  - time: "09:00"
    endTime: "09:15"
    label: "Move to Halls / Seating"
    icon: "🚶"
    glance: false
  - time: "09:15"
    endTime: "09:30"
    label: "Opening — Organisers Welcome"
    icon: "🎬"
  - time: "10:10"
    endTime: "10:15"
    label: "Platinum Sponsor Keynote"
    icon: "⭐"
    glance: false
  - time: "10:15"
    endTime: "10:45"
    label: "Break + Solutions Showcase"
    icon: "🤝"
  - time: "12:45"
    endTime: "13:00"
    label: "Buffer / Move to Lunch Area"
    icon: "🚶"
    glance: false
  - time: "13:00"
    endTime: "14:00"
    label: "Lunch + Solutions Showcase"
    icon: "🍽️"
  - time: "14:00"
    endTime: "14:25"
    label: "Platinum Sponsor Tech Talk"
    icon: "⭐"
    room: "Hall 1"
    glance: false
  - time: "14:30"
    endTime: "14:55"
    label: "Women in Tech Gathering"
    icon: "💜"
    room: "Hall 2"
    glance: false
  - time: "15:00"
    endTime: "15:25"
    label: "Reserved Session"
    icon: "📌"
    room: "Hall 2"
    glance: false
  - time: "16:00"
    endTime: "16:25"
    label: "High Tea + Solutions Showcase"
    icon: "🍵"
  - time: "17:00"
    endTime: "17:10"
    label: "Reserved Lightning Talk"
    icon: "📌"
    room: "Hall 2"
    glance: false
  - time: "17:25"
    endTime: "17:45"
    label: "Panel / Fireside — TBA"
    icon: "🗣️"
  - time: "17:45"
    endTime: "18:00"
    label: "Closing: Vote of Thanks, Group Photo, Swag"
    icon: "🎉"
  - time: "18:00"
    label: "Event Ends"
    icon: "👋"
---
