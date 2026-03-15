import Link from 'next/link';
import Image from 'next/image';
import db from '@/lib/db';
import { FadeIn } from '@/components/FadeIn';
import styles from './blogs.module.css';
import { Blog } from '@/types';

export const dynamic = 'force-dynamic';

async function getBlogs(): Promise<Blog[]> {
  const rs = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
  const dbBlogs = rs.rows;

  if (dbBlogs.length > 0) {
    return dbBlogs.map((b: any) => ({
      ...b,
      id: Number(b.id),
      title: String(b.title),
      excerpt: String(b.excerpt),
      content: String(b.content),
      read_time: String(b.read_time),
      image: b.image ? String(b.image) : undefined,
      created_at: String(b.created_at)
    }));
  } else {
    return [
      {
        id: 1,
        title: 'The Future of Minimalist Design',
        excerpt: 'Exploring how removing the unnecessary focuses attention and drives business value in modern web architecture.',
        created_at: '2026-04-10',
        read_time: '5 min read',
        content: 'This is a placeholder content for the first blog post.',
        image: undefined
      },
      {
        id: 2,
        title: 'Why Dark Mode is More Than a Trend',
        excerpt: 'Deep dive into the ergonomic, aesthetic, and battery-saving benefits of shipping premium dark mode experiences.',
        created_at: '2026-03-28',
        read_time: '4 min read',
        content: 'This is a placeholder content for the second blog post.',
        image: undefined
      },
      {
        id: 3,
        title: 'Building Royal Digital Experiences',
        excerpt: 'A case study on how we utilized a refined color palette and stark typography to increase engagement by 300%.',
        created_at: '2026-02-15',
        read_time: '8 min read',
        content: 'This is a placeholder content for the third blog post.',
        image: undefined
      }
    ];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();
  
  const getIconUrl = (val: string) => {
    if (!val) return '';
    const strVal = String(val);
    if (strVal.startsWith('http')) {
      const isDrive = strVal.includes('drive.google.com') || strVal.includes('lh3.googleusercontent.com');
      if (isDrive) {
        const driveId = strVal.match(/[-\w]{25,}/)?.[0];
        if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
      }
      return strVal;
    }
    if (strVal.startsWith('data:')) return strVal;
    return '';
  };

  return (
    <div className="container section">
      <FadeIn>
        <h1 className="title">Insights & Perspectives</h1>
        <p className="subtitle">Curated thoughts from the RK team on design, technology, and elegance.</p>
      </FadeIn>
      
      <div className={styles.blogGrid}>
        {blogs.map((blog, idx) => (
          <FadeIn key={blog.id} delay={idx * 0.15}>
            <article className={styles.blogCard}>
              {/* Image Header */}
              <div className={styles.blogCardImage} style={{ position: 'relative' }}>
                {blog.image ? (
                  <Image 
                    src={getIconUrl(blog.image)} 
                    alt={blog.title} 
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    unoptimized
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                    <span style={{ fontSize: '4rem' }}>📄</span>
                  </div>
                )}
              </div>
              
              <div className={styles.blogCardContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  <span>{blog.read_time}</span>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: '1.4', fontFamily: 'var(--font-playfair)' }}>{blog.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.6' }}>{blog.excerpt}</p>
                
                <div>
                  <Link href={`/blogs/${blog.id}`} style={{ color: 'var(--accent-primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Read Article <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
