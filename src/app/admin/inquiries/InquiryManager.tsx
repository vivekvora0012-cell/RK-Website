'use client';

import * as React from 'react';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import { deleteInquiry, markInquiryAsRead } from '@/app/actions/inquiryActions';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: number;
  created_at: string;
}

interface InquiryManagerProps {
  initialInquiries: Inquiry[];
}

export function InquiryManager({ initialInquiries }: InquiryManagerProps) {
  const [inquiries, setInquiries] = React.useState(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = React.useState<Inquiry | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteInquiry(id);
        setInquiries(prev => prev.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (error) {
        console.error('Failed to delete inquiry:', error);
        alert('Failed to delete the inquiry. Please try again.');
      }
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markInquiryAsRead(id);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, is_read: 1 } : i));
      if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, is_read: 1 });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Helper function to format date safely for hydration
  const formatDate = (dateStr: string, includeTime = false) => {
    if (!isMounted) return ''; // Return empty or a placeholder during SSR
    const date = new Date(dateStr);
    return includeTime ? date.toLocaleString() : date.toLocaleDateString();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedInquiry ? '1fr 400px' : '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>
      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1.25rem', color: 'var(--text-secondary)', width: '40px' }}>Status</th>
              <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>From</th>
              <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>Message Preview</th>
              <th style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1.25rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No messages found.
                </td>
              </tr>
            ) : inquiries.map(inquiry => (
              <tr 
                key={inquiry.id} 
                onClick={() => setSelectedInquiry(inquiry)}
                style={{ 
                  borderBottom: '1px solid var(--border-color)', 
                  cursor: 'pointer',
                  backgroundColor: selectedInquiry?.id === inquiry.id ? 'rgba(var(--accent-primary-rgb), 0.05)' : inquiry.is_read ? 'transparent' : 'rgba(var(--accent-primary-rgb), 0.02)',
                  transition: 'background-color 0.2s'
                }}
                className="hover-row"
              >
                <td style={{ padding: '1.25rem' }}>
                  {inquiry.is_read ? (
                    <CheckCircle size={18} style={{ color: '#10b981' }} />
                  ) : (
                    <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
                  )}
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: inquiry.is_read ? 400 : 600 }}>{inquiry.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inquiry.email}</div>
                </td>
                <td style={{ padding: '1.25rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {inquiry.message}
                </td>
                <td style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {formatDate(inquiry.created_at)}
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                    {!inquiry.is_read && (
                      <button onClick={() => handleMarkAsRead(inquiry.id)} title="Mark as Read" style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Mail size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(inquiry.id)} title="Delete" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInquiry && (
        <div style={{ 
          backgroundColor: 'var(--bg-primary)', 
          padding: '2rem', 
          borderRadius: '1rem', 
          border: '1px solid var(--border-color)',
          height: 'fit-content',
          position: 'sticky',
          top: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'Playfair Display' }}>Message Details</h3>
            <button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Contact Info</label>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{selectedInquiry.email}</div>
              {selectedInquiry.phone && <div style={{ color: 'var(--text-primary)', marginTop: '0.25rem' }}>{selectedInquiry.phone}</div>}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Date Received</label>
              <div>{formatDate(selectedInquiry.created_at, true)}</div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', minHeight: '150px' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Message</label>
              <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedInquiry.message}</div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {!selectedInquiry.is_read && (
                <button onClick={() => handleMarkAsRead(selectedInquiry.id)} className="btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
                  Mark as Read
                </button>
              )}
              <button onClick={() => handleDelete(selectedInquiry.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ef4444', color: '#ef4444', background: 'none', cursor: 'pointer' }}>
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
