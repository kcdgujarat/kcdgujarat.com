/** Normalized site-wide social profile URLs (from `content/pages/social.md`). */
export type SiteSocialLinks = {
  x?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  youtube?: string;
};

/** Accepts raw frontmatter keys (`x` or legacy `twitter`) and returns a clean link map. */
export function normalizeSiteSocialLinks(raw: Record<string, unknown>): SiteSocialLinks {
  const pick = (key: string) => {
    const value = raw[key];
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
  };

  const links: SiteSocialLinks = {};
  const x = pick('x') ?? pick('twitter');
  if (x) links.x = x;
  const linkedin = pick('linkedin');
  if (linkedin) links.linkedin = linkedin;
  const instagram = pick('instagram');
  if (instagram) links.instagram = instagram;
  const github = pick('github');
  if (github) links.github = github;
  const youtube = pick('youtube');
  if (youtube) links.youtube = youtube;
  return links;
}

export function hasSiteSocialLinks(links: SiteSocialLinks): boolean {
  return Boolean(links.x || links.linkedin || links.instagram || links.github || links.youtube);
}
