import db from '@/lib/db';
import { FadeIn } from '@/components/FadeIn';
import { VideoPlayer } from '@/components/VideoPlayer';
import styles from './videos.module.css';

export const dynamic = 'force-dynamic';

export default async function Videos() {
  const rs = await db.execute('SELECT * FROM videos ORDER BY created_at DESC');
  const dbVideos = rs.rows;

  const videos = dbVideos.length > 0 ? dbVideos.map((v: any) => ({
    title: String(v.title),
    duration: String(v.duration),
    url: String(v.url)
  })) : [
    { title: 'RK Design Philosophy masterclass', duration: '12:45', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { title: 'Behind the aesthetic: Royal Interfaces', duration: '08:20', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { title: 'Next.js 2026 Performance Optimization', duration: '15:10', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { title: 'Building the Minimalist Component Library', duration: '22:00', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  ];

  return (
    <div className="container section">
      <FadeIn>
        <h1 className={`${styles.videoTitle} title`}>Video Gallery</h1>
        <p className="subtitle">Visual insights, tutorials, and behind-the-scenes content.</p>
      </FadeIn>

      <div className={styles.videoGrid}>
        {videos.map((vid, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <VideoPlayer title={vid.title} url={vid.url} duration={vid.duration} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
