'use client';

import * as React from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { addService, deleteService, updateService } from '@/app/actions/serviceActions';
import { Service } from '@/types';

interface ServiceManagerProps {
  initialServices: Service[];
}

export function ServiceManager({ initialServices }: ServiceManagerProps) {
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [selectedIcon, setSelectedIcon] = React.useState('⚙️');
  const formRef = React.useRef<HTMLFormElement>(null);

  const getDriveId = (url: string) => {
    const regExp = /[-\w]{25,}/;
    const match = url.match(regExp);
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

  const INDUSTRIAL_EMOJIS = [
    '⚙️', '🔧', '🤖', '🛠️', '📐', '🔬', '🏭', '🏗️', '🔌', '📦', 
    '🚛', '💎', '🛡️', '⚡', '📊', '🔥', '❄️', '💠', '🔩'
  ];

  React.useEffect(() => {
    if (editingService) {
      setSelectedIcon(editingService.icon);
    } else {
      setSelectedIcon('⚙️');
    }
  }, [editingService]);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingService(null);
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingService) {
      await updateService(editingService.id, formData);
      setEditingService(null);
    } else {
      await addService(formData);
    }
    if (formRef.current) formRef.current.reset();
    setSelectedIcon('⚙️');
  };

  const iconUrl = getIconUrl(selectedIcon);

  return (
    <div>
      {/* Form Section */}
      <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--text-primary)', margin: 0 }}>
            {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
          </h2>
          {editingService && (
            <button 
              onClick={cancelEdit}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <form 
          ref={formRef}
          action={handleSubmit} 
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Service Title *</label>
            <input 
              type="text" 
              name="title" 
              required 
              defaultValue={editingService?.title || ''}
              key={editingService ? `edit-title-${editingService.id}` : 'add-title'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
            />
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Icon (Emoji or Image Link) *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ 
                width: '3.5rem', 
                height: '3.5rem', 
                flexShrink: 0,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'var(--bg-secondary)', 
                borderRadius: '0.5rem', 
                border: '1px solid var(--border-color)',
                fontSize: '1.5rem',
                overflow: 'hidden'
              }}>
                {iconUrl ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image src={iconUrl} alt="Icon Preview" fill style={{ objectFit: 'contain' }} unoptimized />
                  </div>
                ) : (
                  selectedIcon
                )}
              </div>
              <input 
                type="text" 
                name="icon" 
                required 
                placeholder="Emoji or Image URL..."
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Quick Select Emoji:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              {INDUSTRIAL_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  style={{
                    fontSize: '1.5rem',
                    padding: '0.5rem',
                    background: selectedIcon === emoji ? 'var(--accent-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: '0.2s',
                    opacity: selectedIcon === emoji ? 1 : 0.7
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = selectedIcon === emoji ? '1' : '0.7'}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'block', margin: '0.5rem 0', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Description *</label>
            <textarea 
              name="description" 
              required 
              rows={4} 
              defaultValue={editingService?.description || ''}
              key={editingService ? `edit-desc-${editingService.id}` : 'add-desc'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
            ></textarea>
          </div>
          <div style={{ width: '100%', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
              {editingService ? <><Edit2 size={18} /> Update Service</> : <><Plus size={18} /> Add Service</>}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Icon</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Service Title</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Description Snippet</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialServices.map(s => {
              const iconUrl = getIconUrl(s.icon);
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontSize: '1.5rem' }}>
                    {iconUrl ? (
                      <div style={{ position: 'relative', width: '2.5rem', height: '2.5rem', borderRadius: '0.25rem', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <Image src={iconUrl} alt={s.title} fill style={{ objectFit: 'contain' }} unoptimized />
                      </div>
                    ) : (
                      s.icon
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{s.title}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.description}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(s)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <form action={deleteService.bind(null, s.id)}>
                        <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
