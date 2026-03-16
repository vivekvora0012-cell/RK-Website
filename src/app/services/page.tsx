import Image from 'next/image';
import { FadeIn } from '@/components/FadeIn';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getServices() {
  const rs = await db.execute('SELECT * FROM services ORDER BY created_at DESC');
  return rs.rows;
}

export default async function Services() {
  const dbServices = await getServices();
  
  // Fallback for initial state if user hasn't added any via admin yet
  const services = dbServices.length > 0 ? dbServices : [
    { id: 1, title: 'Custom Gearbox Manufacturing', icon: '⚙️', description: 'Bespoke design and fabrication of gearboxes tailored to unique industrial torque and speed requirements.' },
    { id: 2, title: 'Precision Machining', icon: '🔧', description: 'High-tolerance CNC and VMC machining services for complex industrial components.' },
    { id: 3, title: 'SPM Development', icon: '🤖', description: 'End-to-end engineering of Special Purpose Machines to automate your specific production lines.' },
    { id: 4, title: 'Industrial Maintenance', icon: '🛠️', description: 'Comprehensive repair and maintenance services for heavy machinery to minimize downtime.' },
    { id: 5, title: 'Reverse Engineering', icon: '📐', description: 'Advanced scanning and CAD modeling to recreate or improve upon legacy machinery parts.' },
    { id: 6, title: 'Quality Testing', icon: '🔬', description: 'Rigorous load testing and quality assurance to ensure equipment withstands real-world stress.' },
  ];

  const getIconUrl = (val: string) => {
    if (!val) return '';
    const strVal = String(val);
    if (strVal.startsWith('http')) {
      const isDrive = strVal.includes('drive.google.com') || strVal.includes('lh3.googleusercontent.com');
      if (isDrive) {
        const driveId = strVal.match(/[-\w]{25,}/)?.[0];
        if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
      }
      return strVal;
    }
    if (strVal.startsWith('data:')) return strVal;
    return '';
  };

  return (
    <div className="container section">
      <FadeIn>
        <h1 className="title text-center">Industrial Excellence</h1>
        <p className="subtitle text-center">Comprehensive engineering services tailored for heavy-duty performance.</p>
      </FadeIn>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
        gap: '2rem', 
        marginTop: '4rem' 
      }}>
        {services.map((serviceRow: unknown, idx: number) => {
          const s = serviceRow as Record<string, unknown>;
          const iconUrl = getIconUrl(s.icon as string);
          return (
            <FadeIn key={String(s.id)} delay={idx * 0.1}>
              <div style={{
                padding: '2.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                transition: 'var(--transition)',
                height: '100%',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', height: '3.5rem', display: 'flex', alignItems: 'center' }}>
                  {iconUrl ? (
                    <div style={{ position: 'relative', width: '3.5rem', height: '3.5rem' }}>
                      <Image src={iconUrl} alt={String(s.title)} fill style={{ objectFit: 'contain' }} unoptimized />
                    </div>
                  ) : (
                    <span style={{ fontSize: '2.5rem' }}>{(s.icon as string) || '⚙️'}</span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>{String(s.title)}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{String(s.description)}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
