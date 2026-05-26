---
# Optional: override the contact email shown on this page.
# Leave blank to fall back to the global contactEmail in Payload settings.
contactEmail: ""

# Optional: link to a PDF prospectus.
prospectusUrl: ""

# ─── Sponsorship tiers ────────────────────────────────────────────────────────
# `slug` must match the tier enum used in content/sponsors/*.md:
#   diamond | platinum | gold | silver | community | media
# `price` is display-only (e.g. "₹5,00,000" or "— top tier —").
# `perks` is a list of benefit bullet points shown on the /sponsorship page.
tiers:
  - name: "Diamond"
    slug: "diamond"
    price: "— top tier —"
    perks:
      - "Keynote speaking slot"
      - "Top logo placement on all materials"
      - "Premium booth location"
      - "Recruitment table"
      - "Social media shoutout"

  - name: "Platinum"
    slug: "platinum"
    price: "priority placement"
    perks:
      - "Workshop or session slot"
      - "Premium booth space"
      - "Logo on stage backdrop"
      - "Social media mention"

  - name: "Gold"
    slug: "gold"
    price: "standard placement"
    perks:
      - "Booth space"
      - "Logo on website & lanyard"
      - "Recognition during opening"

  - name: "Silver"
    slug: "silver"
    price: "community tier"
    perks:
      - "Logo on website"
      - "Recognition during opening ceremony"

  - name: "Community"
    slug: "community"
    price: "in-kind"
    perks:
      - "Booth or signage"
      - "Cross-promotion on social media"

  - name: "Media"
    slug: "media"
    price: "in-kind"
    perks:
      - "Logo on website"
      - "Cross-promotion"
---
