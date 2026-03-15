import { getVideos } from '@/app/actions/videoActions';
import { VideoManager } from './VideoManager';
import { Video } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ManageVideos() {
  const videos = (await getVideos()) as unknown as Video[];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Video Gallery</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage the visual showcase of RK machinery and tutorials.</p>
      </div>

      <VideoManager initialVideos={videos} />
    </div>
  );
}
