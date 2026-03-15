import { getBlogs } from '@/app/actions/blogActions';
import { BlogManager } from './BlogManager';
import { Blog } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ManageBlogs() {
  const blogs = (await getBlogs()) as unknown as Blog[];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Editorial / Blog</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage articles and industry insights published on the RK website.</p>
      </div>

      <BlogManager initialBlogs={blogs} />
    </div>
  );
}
