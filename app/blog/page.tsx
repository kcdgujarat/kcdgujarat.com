import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Card, CardBody } from '@/components/ui/card';
import { getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Blog',
  path: '/blog',
  description: 'News, updates, and stories from KCD Gujarat 2026.',
});

export default async function BlogIndex() {
  const posts = await getBlogPosts();
  return (
    <Container className="py-16">
      <SectionHeader eyebrow="Blog" title="News & updates" />
      {posts.length === 0 ? (
        <p className="text-kcd-muted">No posts yet.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`}>
                <Card>
                  <CardBody>
                    <p className="text-xs uppercase tracking-wider text-kcd-muted">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Draft'}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-kcd-ink">{p.title}</h3>
                    {p.excerpt && <p className="mt-2 text-sm text-kcd-muted">{p.excerpt}</p>}
                  </CardBody>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
