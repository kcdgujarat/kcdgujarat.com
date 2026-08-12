---
# Optional: override the contact email shown on this page.
# Leave blank to fall back to the global contactEmail in Payload settings.
contactEmail: "contact@kcdgujarat.com"

# PDF prospectus served from static/ (URL: /static/prospectus.pdf).
# Omit to default to static/prospectus.pdf when that file exists.
prospectus: "prospectus.pdf"

# Lead-in pitch shown under the page title.
intro: >-
  KCD Gujarat 2026 brings the cloud native community of Gujarat and western
  India together for a community-driven, CNCF-backed day of talks and
  connection. Sponsoring puts your brand in front of a highly engaged,
  technical audience — and directly fuels the growth of open source and cloud
  native across the region.

# ─── Why sponsor ──────────────────────────────────────────────────────────────
reasons:
  - title: "High-Profile Audience"
    description: "Reach developers, platform engineers, SREs, and architects who are actively building on Kubernetes and cloud native."
  - title: "Qualified Leads"
    description: "Connect with practitioners and decision-makers evaluating cloud native tools, platforms, and services."
  - title: "Talent Acquisition"
    description: "Meet and hire skilled cloud native engineers and tap into the on-site job board."
  - title: "Thought Leadership"
    description: "Share your expertise through talks and demos in a vendor-neutral setting."
  - title: "Brand Visibility"
    description: "Put your logo on stage, across the venue, website, lanyards, and marketing — in front of an engaged crowd."
  - title: "Support Open Source"
    description: "Back the CNCF community and the growth of cloud native in Gujarat and western India."
  - title: "Community Access"
    description: "Build lasting relationships with the regional community, contributors, and maintainers."
  - title: "Solutions Showcase"
    description: "Demo your products at a booth and get direct, hands-on feedback from real users."

# ─── Who you'll reach ───────────────────────────────────────────────────────────
audience:
  - "Developers, platform & DevOps engineers, SREs, and software architects"
  - "Startup founders, CTOs, and enterprise technology decision-makers"
  - "Students and early-career engineers entering cloud native"
  - "CNCF community members, contributors, and maintainers from Gujarat & western India"

# Optional contract deadline note — set once confirmed, e.g.
#   deadline: "Signed contracts for all sponsorship levels are due 15 August 2026."

# Short sponsor terms / code-of-conduct note shown at the foot of the page.
terms: >-
  All sponsors agree to uphold the CNCF Code of Conduct. Attendee contact
  details are shared only with explicit opt-in consent, in line with our privacy
  commitments. Packages are confirmed on a first-come, first-served basis.

# ─── Sponsorship tiers ────────────────────────────────────────────────────────
# `slug` is a unique package id for this page (e.g. platinum, bronze, diversity).
# Logo-wall tiers for content/sponsors/*.md use: platinum | gold | silver | community | diversity | media
# `price` is display-only (e.g. "₹5,00,000" or "— top tier —").
# `perks` is a list of benefit bullet points shown on the /sponsorship page.
# `group`: "package" (priced headline tiers) or "additional" (add-on / in-kind opportunities).
tiers:
  - name: "Platinum"
    slug: "platinum"
    price: "US$ 5000 (~₹4.7L*)"
    perks:
      - "Large Booth for Maximum on-ground Visibility (10x8 Feet)"
      - "Stage Presence - Opening Keynote (5 Minutes)* + Technical Talk"
      - "Featured in press release"
      - "10 Complimentary Tickets"
      - "40% Discount Code for Guests (8 tickets)"
      - "Dedicated Social Media Promotion (5 times)"
      - "Branding in All Marketing Materials (Videos, Website, Lanyards, Venue, Stage)"
      - "Featured Job Board Access"

  - name: "Gold"
    slug: "gold"
    price: "US$ 3500 (~₹3.3L*)"
    perks:
      - "Medium Booth for on-ground engagement (8x8 Feet)"
      - "Stage Presence - Technical Talk / Breakout Session + 2-minute stage mention"
      - "Featured in press release"
      - "6 Complimentary Tickets"
      - "30% Discount Code for Guests (5 tickets)"
      - "Dedicated Social Media promotional mention (4 times)"
      - "Branding in All Marketing Materials (Videos, Website, Lanyards, Venue, Stage)"
      - "Hiring/Job Board Access"

  - name: "Silver"
    slug: "silver"
    price: "US$ 2500 (~₹2.4L*)"
    perks:
      - "Standard booth for showcasing your products and engaging with attendees (6x8 Feet)"
      - "Lightning Talk"
      - "Featured in press release"
      - "4 Complimentary Tickets"
      - "30% Discount Code for Guests (3 tickets)"
      - "Dedicated Social Media promotional mention (3 times)"
      - "Branding in All Marketing Materials (Videos, Website, Lanyards, Venue, Stage)"
      - "Hiring/Job Board Access (Optional)"

  - name: "Bronze"
    slug: "bronze"
    price: "US$ 1200 (~₹1.1L*)"
    perks:
      - "Table Space (no booth)"
      - "Option to Upgrade Booth at Discounted Rate"
      - "Branding on Selected Marketing Materials"
      - "3 Complimentary Tickets"
      - "15% Discount Code for Guests (3 tickets)"
      - "Dedicated Social Media promotional mention (2 times)"
      - "Logo Placement on the Event Website and Venue"
      - "Hiring/Job Board Access (Optional)"

  - name: "Diversity"
    slug: "diversity"
    price: "US$ 800 (~₹75K*)"
    group: "additional"
    perks:
      - "Recognition as the 'Diversity Sponsor' of KCD Gujarat"
      - "Branding across diversity-focused communications and initiatives"
      - "Dedicated social media mention highlighting your support for inclusivity"
      - "Logo placement on the event website"
      - "Opportunity to support diversity scholarships/tickets"
      - "On-stage acknowledgment during the event"
      - "2 Complimentary Tickets"

  - name: "Swag"
    slug: "swag"
    price: "US$ 800 (~₹75K*)"
    group: "additional"
    perks:
      - "Branding on official event swag (e.g., Tshirts, kits, goodies)"
      - "Opportunity to co-brand exclusive merchandise"
      - "Logo placement on the event website"
      - "Dedicated social media mention"
      - "Visibility during swag distribution at the event"
      - "Option to include custom inserts (stickers, flyers, coupons) in swag kits"
      - "2 Complimentary Tickets"

  - name: "Community Partner"
    slug: "community"
    price: "In Kind"
    group: "additional"
    perks:
      - "1 Ticket"
      - "Presence in the community zone: a dedicated space within the event venue"
      - "Keynote Mention"
      - "Logo on website"

  - name: "Venue Partner"
    slug: "venue"
    price: "In Kind"
    group: "additional"
    perks:
      - "Logo on banners and social media channels"
      - "Branding at the venue entrance and across event standees"
      - "Special acknowledgment during the opening session"
      - "Dedicated social media appreciation post"
      - "Logo on website"
      - "3 Complimentary Tickets"
---
