---
# ─── Hero copy ───────────────────────────────────────────────────────────────
# Leave headline blank to use the default generated text. The hero prints the
# event date + city under it — there is no tagline line any more.
headline: ""

# ─── Event details ────────────────────────────────────────────────────────────
# ISO 8601 date-times in IST (UTC+05:30). Used in the hero badge, schedule
# section, JSON-LD, and sitemap.
eventDate: "2026-09-19T07:30:00+05:30"
eventEndDate: "2026-09-19T18:00:00+05:30"

# City shown under the hero date lockup and on the coming-soon page.
city: "Ahmedabad, Gujarat"

# ─── Venue ────────────────────────────────────────────────────────────────────
venueName: "Narayani Heights"
venueAddress: "Ahmedabad Airport–Gandhinagar Road, adjacent to Apollo Hospital, Bhat, Gandhinagar, Gujarat 382428"
# Paste a Google Maps embed src URL (the value inside the <iframe src="…">).
# Must stay on www.google.com — proxy.ts only allows that host in frame-src.
mapEmbedUrl: "https://www.google.com/maps?q=Narayani+Heights,+Airport-Gandhinagar+Road,+Bhat,+Ahmedabad,+Gujarat+382428&output=embed"
venueUrl: "https://narayaniheights.com/"
venueDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.111919%2C72.629250"
# [latitude, longitude] — feeds Place.geo in the JSON-LD on /venue.
venueCoordinates: [23.111919, 72.62925]

# Photos live in public/images/venue/. Filenames carry a content hash, so
# replacing a photo means a new filename here too (see handoff.md).
# `width`/`height` are the file's real pixel size — the click-to-enlarge
# lightbox uses them so the photo sizes to its own aspect with no dead space.
venuePhotos:
  - src: "/images/venue/narayani-heights-exterior-259c3ccb.jpg"
    alt: "The Narayani Heights hotel building at dusk, seen from its front driveway"
    caption: "Narayani Heights, on the Ahmedabad–Gandhinagar highway at Bhat."
    width: 1600
    height: 1200
  - src: "/images/venue/narayani-heights-conference-hall-10d8df25.jpg"
    alt: "A large banquet hall set up with a raised stage, lectern, and rows of tables"
    caption: "The banquet hall in conference layout — our main stage for the day."
    width: 2400
    height: 1600
  - src: "/images/venue/narayani-heights-grand-ballroom-f2c15ea0.jpg"
    alt: "The Grand Ballroom, a wide pillarless hall under chandeliers, set with round tables"
    caption: "The Grand Ballroom, which splits into the second track hall."
    width: 2400
    height: 1610

# Road distances, not straight lines. `driveMinutes` allows for normal
# Ahmedabad traffic, so it is deliberately longer than a free-flow estimate.
venueTravel:
  - from: "Ahmedabad Airport (SVPI)"
    icon: "plane"
    distanceKm: 7
    driveMinutes: 20
    note: "The closest airport to the venue — Terminal 2 (international) is nearer than Terminal 1. Autos and cabs queue outside both."
    order: 10
  - from: "Ranip Bus Stand"
    icon: "bus"
    distanceKm: 11
    driveMinutes: 30
    note: "GSRTC buses from across Gujarat terminate here. Cross to the Ahmedabad–Gandhinagar highway for a cab."
    order: 20
  - from: "Ahmedabad Junction (Kalupur)"
    icon: "train"
    distanceKm: 15
    driveMinutes: 35
    note: "If your train also halts at Sabarmati Junction, get off there instead — it is roughly half the distance."
    order: 30

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
