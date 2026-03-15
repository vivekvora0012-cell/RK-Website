'use client';

import Link from 'next/link';
import { Home, Package, Box, FileText, Video, Bell, LogOut, Mail } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Sidebar sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--bg-primary)', 
        borderRight: '1px solid var(--border-color)',
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--royal-navy)', margin: 0 }}>R.K. Admin</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/admin/products" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Package size={18} /> Manage Products
          </Link>
          <Link href="/admin/services" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Box size={18} /> Manage Services
          </Link>
          <Link href="/admin/blogs" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <FileText size={18} /> Manage Blogs
          </Link>
          <Link href="/admin/videos" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Video size={18} /> Manage Videos
          </Link>
          <Link href="/admin/inquiries" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Mail size={18} /> Manage Inquiries
          </Link>
          <Link href="/admin/slideshow" style={{ padding: '0.75rem 1rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Home size={18} /> Manage Slideshow
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '0 2rem' }}>
          <form action={logout}>
             <button type="submit" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0', color: 'inherit' }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', color: '#ef4444', fontWeight: 500, transition: 'color 0.2s'}}>
                    <LogOut size={16} /> Secure Sign Out
                </div>
             </button>
          </form>
          <Link href="/" style={{ color: 'var(--text-secondary)', display: 'block', padding: '1rem 0', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
            ← Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '3rem', margin: '0 20px' }}>
        {children}
      </main>
    </div>
  );
}
