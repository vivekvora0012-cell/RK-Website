'use client';

import * as React from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { addSlide, deleteSlide, updateSlide } from '@/app/actions/slideshowActions';
import { Slide } from '@/types';

interface SlideshowManagerProps {
  initialSlides: Slide[];
}

export function SlideshowManager({ initialSlides }: SlideshowManagerProps) {
  const [editingSlide, setEditingSlide] = React.useState<Slide | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const getDriveId = (url: string) => {
    const regExp = /[-\w]{25,}/;
    const match = url.match(regExp);
    return match ? match[0] : null;
  };

  const getImageUrl = (val: string) => {
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
    
    return strVal;
  };

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingSlide(null);
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingSlide) {
      await updateSlide(editingSlide.id, formData);
      setEditingSlide(null);
    } else {
      await addSlide(formData);
    }
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div>
      <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-primary)', margin: 0 }}>
            {editingSlide ? `Edit Slide: ${editingSlide.title}` : 'Add New Slide'}
          </h2>
          {editingSlide && (
            <button 
              onClick={cancelEdit}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Slide Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                defaultValue={editingSlide?.title || ''}
                key={editingSlide ? `slide-title-${editingSlide.id}` : 'slide-title'}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Image URL (Google Drive) *</label>
              <input 
                type="text" 
                name="image_url" 
                required 
                placeholder="Google Drive link or direct URL..."
                defaultValue={editingSlide?.image_url || ''}
                key={editingSlide ? `slide-url-${editingSlide.id}` : 'slide-url'}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Description *</label>
            <textarea 
              name="description" 
              required 
              rows={3}
              defaultValue={editingSlide?.description || ''}
              key={editingSlide ? `slide-desc-${editingSlide.id}` : 'slide-desc'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ width: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Order Index</label>
            <input 
              type="number" 
              name="order_index" 
              defaultValue={editingSlide?.order_index || 0}
              key={editingSlide ? `slide-order-${editingSlide.id}` : 'slide-order'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {editingSlide ? <><Edit2 size={18} /> Update Slide</> : <><Plus size={18} /> Add Slide</>}
          </button>
        </form>
      </div>

      <div style={{ background: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Preview</th>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Order</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialSlides.map(slide => (
              <tr key={slide.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ position: 'relative', width: '100px', height: '60px', borderRadius: '0.25rem', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    <Image src={getImageUrl(slide.image_url) || ''} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{slide.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slide.description}</div>
                </td>
                <td style={{ padding: '1rem' }}>{slide.order_index}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(slide)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => deleteSlide(slide.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialSlides.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No slides added yet. Add your first industrial showcase slide above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
