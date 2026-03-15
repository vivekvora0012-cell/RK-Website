'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { addBlog, deleteBlog, updateBlog } from '@/app/actions/blogActions';

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  read_time: string;
  image?: string;
  created_at: string;
}

interface BlogManagerProps {
  initialBlogs: Blog[];
}

export function BlogManager({ initialBlogs }: BlogManagerProps) {
  const [editingBlog, setEditingBlog] = React.useState<Blog | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const formRef = React.useRef<HTMLFormElement>(null);

  const getDriveId = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  const getIconUrl = (val: string) => {
    if (!val) return null;
    const strVal = String(val);
    const isLink = strVal.startsWith('http') || strVal.startsWith('data:');
    if (!isLink) return null;
    
    // Check if it's a Google Drive link
    const isDrive = strVal.includes('drive.google.com') || strVal.includes('lh3.googleusercontent.com');
    if (isDrive) {
      const driveId = getDriveId(strVal);
      if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
    }
    
    // Otherwise return as is (for standard images/icons/base64)
    return strVal;
  };

  const currentPreview = getIconUrl(imageUrl);

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setImageUrl(blog.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingBlog(null);
    setImageUrl('');
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingBlog) {
      await updateBlog(editingBlog.id, formData);
      setEditingBlog(null);
      setImageUrl('');
    } else {
      await addBlog(formData);
    }
    if (formRef.current) formRef.current.reset();
    setImageUrl('');
  };

  return (
    <div>
      <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-primary)', margin: 0 }}>
            {editingBlog ? `Edit Post: ${editingBlog.title}` : 'Write New Blog Post'}
          </h2>
          {editingBlog && (
            <button onClick={cancelEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Blog Title *</label>
            <input type="text" name="title" required defaultValue={editingBlog?.title || ''} key={editingBlog ? `e-t-${editingBlog.id}` : 'a-t'} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ flex: '1 1 70%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Short Excerpt *</label>
            <input type="text" name="excerpt" required defaultValue={editingBlog?.excerpt || ''} key={editingBlog ? `e-x-${editingBlog.id}` : 'a-x'} placeholder="A brief summary for the blog card..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ flex: '1 1 25%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Read Time</label>
            <input type="text" name="read_time" defaultValue={editingBlog?.read_time || '5 min read'} key={editingBlog ? `e-r-${editingBlog.id}` : 'a-r'} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Cover Image Link (URL or Google Drive)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <input 
                type="text" 
                name="image" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or Google Drive Link"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
              />
              {currentPreview && (
                <div style={{ width: '100px', height: '100px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={currentPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Content (HTML or Text) *</label>
            <textarea name="content" required rows={8} defaultValue={editingBlog?.content || ''} key={editingBlog ? `e-c-${editingBlog.id}` : 'a-c'} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {editingBlog ? <><Edit2 size={18} /> Update Blog Post</> : <><Plus size={18} /> Publish New Post</>}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '60px' }}>Image</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Published</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialBlogs.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '0.25rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    {b.image ? (
                      <img src={getIconUrl(b.image) || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📄</div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{b.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.read_time}</div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(b)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Edit2 size={14} />
                    </button>
                    <form action={deleteBlog.bind(null, b.id)}>
                      <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
