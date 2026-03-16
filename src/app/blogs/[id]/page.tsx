import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogById } from '@/app/actions/blogActions';
import { FadeIn } from '@/components/FadeIn';
import styles from '../blog-detail.module.css';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blogId = parseInt(id);
  const blog = await getBlogById(blogId);

  if (!blog) {
    notFound();
  }

  const getImageUrl = (val: string) => {
    if (!val) return '';
    if (val.startsWith('http')) {
      const isDrive = val.includes('drive.google.com') || val.includes('lh3.googleusercontent.com');
      if (isDrive) {
        const driveId = val.match(/[-\w]{25,}/)?.[0];
        if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
      }
      return val;
    }
    return val;
  };

  return (
    <div className="container section">
      <div className={styles.blogDetail}>
        <FadeIn>
          <Link href="/blogs" className={styles.backLink}>
            ← Back to Insights
          </Link>
        </FadeIn>

        <article>
          <FadeIn delay={0.1}>
            <header className={styles.blogHeader}>
              <div className={styles.blogMeta} style={{ opacity: 0.8 }}>
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{blog.read_time.includes('read') ? blog.read_time.split('read')[0] + 'read' : blog.read_time}</span>
              </div>
              <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '2rem', color: 'var(--royal-navy)' }}>{blog.title}</h1>
              <p className="subtitle" style={{ fontSize: '1.25rem', opacity: 0.9 }}>{blog.excerpt}</p>
            </header>
          </FadeIn>

          <FadeIn delay={0.2}>
            {blog.image && (
              <div className={styles.featuredImage}>
                <Image
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className={styles.blogBody}>
              {/* Splitting content by newlines for basic formatting */}
              {blog.content.split('\n').map((paragraph: string, i: number) => (
                paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
              ))}
            </div>
          </FadeIn>
        </article>
      </div>
    </div>
  );
}
