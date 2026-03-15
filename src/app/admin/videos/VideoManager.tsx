'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, Play } from 'lucide-react';
import { addVideo, deleteVideo, updateVideo } from '@/app/actions/videoActions';
import { Video } from '@/types';

interface VideoManagerProps {
  initialVideos: Video[];
}

export function VideoManager({ initialVideos }: VideoManagerProps) {
  const [editingVideo, setEditingVideo] = React.useState<Video | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingVideo) {
      await updateVideo(editingVideo.id, formData);
      setEditingVideo(null);
    } else {
      await addVideo(formData);
    }
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div>
      <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          {editingVideo ? `Edit Video: ${editingVideo.title}` : 'Add New Gallery Video'}
        </h2>
        
        <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Video Title *</label>
            <input type="text" name="title" required defaultValue={editingVideo?.title || ''} key={editingVideo ? `ev-t-${editingVideo.id}` : 'av-t'} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Video URL (YouTube/Drive) *</label>
            <input type="text" name="url" required defaultValue={editingVideo?.url || ''} key={editingVideo ? `ev-u-${editingVideo.id}` : 'av-u'} placeholder="https://..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ width: '100%', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {editingVideo ? <><Edit2 size={18} /> Update Video</> : <><Plus size={18} /> Add Video</>}
            </button>
            {editingVideo && (
              <button type="button" onClick={cancelEdit} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {initialVideos.map(v => (
          <div key={v.id} style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ height: '170px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Play size={40} color="var(--accent-primary)" opacity={0.5} />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', height: '2.4rem', overflow: 'hidden' }}>{v.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(v.created_at).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleEdit(v)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                  <form action={deleteVideo.bind(null, v.id)}>
                    <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
