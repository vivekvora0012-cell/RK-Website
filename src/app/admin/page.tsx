import db from '@/lib/db';
import { Inquiry } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const productsRS = await db.execute('SELECT COUNT(*) as count FROM products');
  const productsCount = Number(productsRS.rows[0].count);
  
  const servicesRS = await db.execute('SELECT COUNT(*) as count FROM services');
  const servicesCount = Number(servicesRS.rows[0].count);
  
  const blogsRS = await db.execute('SELECT COUNT(*) as count FROM blogs');
  const blogsCount = Number(blogsRS.rows[0].count);
  
  const inquiriesRS = await db.execute('SELECT COUNT(*) as count FROM inquiries WHERE is_read = 0');
  const unreadInquiriesCount = Number(inquiriesRS.rows[0].count);

  const recentInquiriesRS = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5');
  const recentInquiries = recentInquiriesRS.rows;
  
  return (
    <div>
      <h1 className="title" style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Overview of R.K. Industries activity and modules.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {/* Stat Cards */}
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Total Products</p>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Inter', color: 'var(--accent-primary)' }}>{productsCount}</h2>
        </div>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Total Services</p>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Inter', color: 'var(--accent-primary)' }}>{servicesCount}</h2>
        </div>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Published Blogs</p>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Inter', color: 'var(--accent-primary)' }}>{blogsCount}</h2>
        </div>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Unread Inquiries</p>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Inter', color: unreadInquiriesCount > 0 ? '#ef4444' : 'var(--text-secondary)' }}>{unreadInquiriesCount}</h2>
        </div>
      </div>

      <div style={{ marginTop: '3rem', backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Inquiries</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.length > 0 ? (recentInquiries as unknown as Inquiry[]).map((inquiry) => (
                <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{inquiry.name}</td>
                  <td style={{ padding: '1rem' }}>{inquiry.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      backgroundColor: inquiry.is_read ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: inquiry.is_read ? '#22c55e' : '#ef4444'
                    }}>
                      {inquiry.is_read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent inquiries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
