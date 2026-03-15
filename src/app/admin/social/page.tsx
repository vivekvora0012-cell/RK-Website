import { getSocialLinks } from '@/app/actions/socialActions';
import { SocialManager } from './SocialManager';
import { SocialLink } from '@/types';

export const metadata = {
  title: 'Manage Social Links | R.K. Industries Admin',
};

export const dynamic = 'force-dynamic';

export default async function ManageSocialLinks() {
  const links = (await getSocialLinks()) as unknown as SocialLink[];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Social Media Links</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage the social media profiles displayed in the website footer.</p>
      </div>

      <SocialManager initialLinks={links} />
    </div>
  );
}
