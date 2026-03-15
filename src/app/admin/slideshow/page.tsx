import { FadeIn } from '@/components/FadeIn';
import { getSlides } from '@/app/actions/slideshowActions';
import { SlideshowManager } from './SlideshowManager';

export const metadata = {
  title: 'Manage Slideshow | R.K. Industries Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminSlideshowPage() {
  const slides = await getSlides();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <FadeIn>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Homepage Slideshow</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your industrial showcase. Add images via Google Drive links to display on the main homepage carousel.</p>
        </div>
      </FadeIn>

      <SlideshowManager initialSlides={slides} />
    </div>
  );
}
