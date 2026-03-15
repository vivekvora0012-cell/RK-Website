'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import { addSocialLink, deleteSocialLink, updateSocialLink } from '@/app/actions/socialActions';
import { SocialLink } from '@/types';

interface SocialManagerProps {
  initialLinks: SocialLink[];
}

export function SocialManager({ initialLinks }: SocialManagerProps) {
  const [editingLink, setEditingLink] = React.useState<SocialLink | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingLink(null);
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingLink) {
      await updateSocialLink(editingLink.id, formData);
      setEditingLink(null);
    } else {
      await addSocialLink(formData);
    }
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div>
      <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-primary)', margin: 0 }}>
            {editingLink ? `Edit Link: ${editingLink.platform}` : 'Add New Social Link'}
          </h2>
          {editingLink && (
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Platform Name *</label>
              <select 
                name="platform" 
                required 
                defaultValue={editingLink?.platform || ''}
                key={editingLink ? `social-platform-${editingLink.id}` : 'social-platform'}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
              >
                <option value="" disabled>Select Platform...</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Youtube">Youtube</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Gmail">Gmail / Email</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Profile URL *</label>
              <input 
                type="url" 
                name="url" 
                required 
                placeholder="https://..."
                defaultValue={editingLink?.url || ''}
                key={editingLink ? `social-url-${editingLink.id}` : 'social-url'}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ width: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Order Index</label>
            <input 
              type="number" 
              name="order_index" 
              defaultValue={editingLink?.order_index || 0}
              key={editingLink ? `social-order-${editingLink.id}` : 'social-order'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {editingLink ? <><Edit2 size={18} /> Update Link</> : <><Plus size={18} /> Add Social Link</>}
          </button>
        </form>
      </div>

      <div style={{ background: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Platform</th>
              <th style={{ padding: '1rem' }}>URL</th>
              <th style={{ padding: '1rem' }}>Order</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialLinks.map(link => (
              <tr key={link.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {link.platform}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {link.url} <ExternalLink size={12} />
                  </a>
                </td>
                <td style={{ padding: '1rem' }}>{link.order_index}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(link)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => deleteSocialLink(link.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialLinks.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No social links added yet. Add your brand profiles above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
