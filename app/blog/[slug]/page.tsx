import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return buildMetadata({ title: 'Post not found' });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <Container className="py-16 max-w-3xl">
      <Link href="/blog" className="text-sm text-kcd-primary hover:underline">
        ← Back to blog
      </Link>
      <article className="mt-6">
        {post.publishedAt && (
          <p className="text-xs uppercase tracking-wider text-kcd-muted">
            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        <h1 className="mt-2 font-display text-4xl font-bold text-kcd-ink">{post.title}</h1>
        <div
          className="prose prose-sm mt-8 max-w-none text-kcd-ink"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </article>
    </Container>
  );
}
