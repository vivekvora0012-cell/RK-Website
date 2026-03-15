import db from '@/lib/db';
import { FadeIn } from '@/components/FadeIn';

export const dynamic = 'force-dynamic';

export default async function Services() {
  const rs = await db.execute('SELECT * FROM services ORDER BY created_at ASC');
  const dbServices = rs.rows;
  
  // Fallback for initial state if user hasn't added any via admin yet
  const services = dbServices.length > 0 ? dbServices.map(s => ({
    title: String(s.title),
    icon: s.icon ? String(s.icon) : '⚙️',
    desc: String(s.description)
  })) : [
    { title: 'Custom Gearbox Manufacturing', icon: '⚙️', desc: 'Bespoke design and fabrication of gearboxes tailored to unique industrial torque and speed requirements.' },
    { title: 'Precision Machining', icon: '🔧', desc: 'High-tolerance CNC and VMC machining services for complex industrial components.' },
    { title: 'SPM Development', icon: '🤖', desc: 'End-to-end engineering of Special Purpose Machines to automate your specific production lines.' },
    { title: 'Industrial Maintenance', icon: '🛠️', desc: 'Comprehensive repair and maintenance services for heavy machinery to minimize downtime.' },
    { title: 'Reverse Engineering', icon: '📐', desc: 'Advanced scanning and CAD modeling to recreate or improve upon legacy machinery parts.' },
    { title: 'Quality Testing', icon: '🔬', desc: 'Rigorous load testing and quality assurance to ensure equipment withstands real-world stress.' },
  ];

  return (
    <div className="container section">
      <FadeIn>
        <h1 className="title text-center">Engineering Services</h1>
        <p className="subtitle text-center">Comprehensive manufacturing and maintenance solutions.</p>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        {services.map((service, index) => {
          const iconValue = String(service.icon || '');
          const isVisual = iconValue.startsWith('http') || iconValue.startsWith('data:');
          let iconUrl = iconValue;
          
          if (isVisual && iconUrl.startsWith('http')) {
            const isDrive = iconUrl.includes('drive.google.com') || iconUrl.includes('lh3.googleusercontent.com');
            if (isDrive) {
               const driveId = iconUrl.match(/[-\w]{25,}/)?.[0];
               if (driveId) iconUrl = `https://lh3.googleusercontent.com/d/${driveId}`;
            }
          }

          return (
            <FadeIn key={index} delay={index * 0.1}>
              <div style={{
                padding: '2.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                transition: 'var(--transition)',
                height: '100%'
              }}
              className="service-card"
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', height: '3.5rem', display: 'flex', alignItems: 'center' }}>
                  {isVisual ? (
                    <img src={iconUrl} alt={service.title} style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
                  ) : (
                    service.icon
                  )}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{service.desc}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
