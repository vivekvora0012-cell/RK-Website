import Link from 'next/link';
import db from '@/lib/db';
import { FadeIn } from '@/components/FadeIn';
import styles from './blogs.module.css';

export const dynamic = 'force-dynamic';

export default async function Blogs() {
  const rs = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
  const dbBlogs = rs.rows;
  
  const blogs = dbBlogs.length > 0 ? dbBlogs.map((b: any) => ({
    ...b,
    id: Number(b.id),
    title: String(b.title),
    excerpt: String(b.excerpt),
    content: String(b.content),
    read_time: String(b.read_time),
    image: b.image ? String(b.image) : null,
    created_at: String(b.created_at)
  })) : [
    {
      id: 1,
      title: 'The Future of Minimalist Design',
      excerpt: 'Exploring how removing the unnecessary focuses attention and drives business value in modern web architecture.',
      created_at: '2026-04-10',
      read_time: '5 min read'
    },
    {
      id: 2,
      title: 'Why Dark Mode is More Than a Trend',
      excerpt: 'Deep dive into the ergonomic, aesthetic, and battery-saving benefits of shipping premium dark mode experiences.',
      created_at: '2026-03-28',
      read_time: '4 min read'
    },
    {
      id: 3,
      title: 'Building Royal Digital Experiences',
      excerpt: 'A case study on how we utilized a refined color palette and stark typography to increase engagement by 300%.',
      created_at: '2026-02-15',
      read_time: '8 min read'
    }
  ];

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
              <div className={styles.blogCardImage}>
                {blog.image ? (
                  <img 
                    src={(() => {
                      const iconUrl = String(blog.image);
                      if (iconUrl.startsWith('http')) {
                        const isDrive = iconUrl.includes('drive.google.com') || iconUrl.includes('lh3.googleusercontent.com');
                        if (isDrive) {
                           const driveId = iconUrl.match(/[-\w]{25,}/)?.[0];
                           if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
                        }
                        return iconUrl;
                      }
                      if (iconUrl.startsWith('data:')) return iconUrl;
                      return '';
                    })()} 
                    alt={blog.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
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
