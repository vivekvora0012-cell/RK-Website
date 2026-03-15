import { FadeIn } from '@/components/FadeIn';

export default function About() {
  return (
    <div className="container section">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <h1 className="title">About RK Machinery</h1>
          <p className="subtitle" style={{ marginBottom: '4rem' }}>
            Forging the future of industrial performance.
          </p>
        </FadeIn>

        <div style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          <FadeIn delay={0.2} distance={20}>
            <p style={{ marginBottom: '1.5rem' }}>
              RK Industries was founded on a commitment to industrial robustnes and mechanical perfection. We specialize in the advanced manufacturing of heavy-duty gearboxes, including Stone Crusher Gearboxes and NU Gearboxes, built to withstand the most demanding conditions.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} distance={20}>
            <p style={{ marginBottom: '1.5rem' }}>
              Beyond gear technology, our engineering division pioneers the development of Automatic SPM (Special Purpose Machine) Drills and Mini VMC (Vertical Machining Center) machines. We don&apos;t just assemble parts; we engineer complete solutions that drive efficiency on the factory floor.
            </p>
          </FadeIn>
          <FadeIn delay={0.4} distance={20}>
            <p>
              With an uncompromising dedication to material quality and precision machining, RK Industries stands as a trusted partner for industries that refuse to compromise on reliability.
            </p>
          </FadeIn>
        </div>

        <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <FadeIn delay={0.2}>
            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>20+</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Years of Excellence</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>100+</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Projects Delivered</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>100%</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Client Satisfaction</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
