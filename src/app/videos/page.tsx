import db from '@/lib/db';
import { FadeIn } from '@/components/FadeIn';
import { VideoPlayer } from '@/components/VideoPlayer';
import styles from './videos.module.css';
import { Video } from '@/types';

export const dynamic = 'force-dynamic';

async function getVideos(): Promise<Video[]> {
  const rs = await db.execute('SELECT * FROM videos ORDER BY created_at DESC');
  const dbVideos = rs.rows;

  if (dbVideos.length > 0) {
    return dbVideos.map((v: unknown) => {
      const row = v as Record<string, unknown>;
      return {
        id: Number(row.id),
        title: String(row.title),
        duration: String(row.duration),
        url: String(row.url),
        created_at: String(row.created_at)
      };
    });
  } else {
    return [
      { id: 1, title: 'RK Design Philosophy masterclass', duration: '12:45', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', created_at: '2026-01-01' },
      { id: 2, title: 'Behind the aesthetic: Royal Interfaces', duration: '08:20', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', created_at: '2026-01-01' },
      { id: 3, title: 'Next.js 2026 Performance Optimization', duration: '15:10', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', created_at: '2026-01-01' },
      { id: 4, title: 'Building the Minimalist Component Library', duration: '22:00', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', created_at: '2026-01-01' },
    ];
  }
}

export default async function Videos() {
  const videos = await getVideos();

  return (
    <div className="container section">
      <FadeIn>
        <h1 className={`${styles.videoTitle} title`}>Video Gallery</h1>
        <p className="subtitle">Visual insights, tutorials, and behind-the-scenes content.</p>
      </FadeIn>

      <div className={styles.videoGrid}>
        {videos.map((vid, i) => (
          <FadeIn key={vid.id || i} delay={i * 0.1}>
            <VideoPlayer title={vid.title} url={vid.url} duration={vid.duration} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
