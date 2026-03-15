import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/FadeIn';
import styles from './page.module.css';
import { HomeSlideshow } from '@/components/HomeSlideshow';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <FadeIn delay={0.1}>
              <h1 className={styles.heroTitle}>
                Precision Engineered <br />
                <span className={styles.heroHighlight}>Industrial Automation Solutions</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className={styles.heroSubtitle}>
                Leading manufacturer of Stone Crusher Conveyor Gearboxes, NU Gearboxes, Automatic SPM Drills, and Mini VMC Machines, and also provide Industrial Automation Solutions. Built for durability, engineered for excellence.
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className={styles.heroActions}>
                <Link href="/products" className="btn-primary">View Our Products</Link>
                <Link href="/contact" className="btn-outline">Request a Quote</Link>
              </div>
            </FadeIn>
          </div>
          <div className={styles.heroVisual}>
            <FadeIn delay={0.4} direction="left">
              <div className={styles.visualCard}>
                <Image
                  src="/BrandLogo.png"
                  alt="R.K. Industries Logo"
                  width={400}
                  height={150}
                  className={styles.heroLogo}
                  priority
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <HomeSlideshow />

      {/* Features/Highlights Section */}
      <section className="section">
        <div className="container text-center">
          <FadeIn>
            <h2 className="title">Why Choose RK Machinery</h2>
            <p className="subtitle">Delivering rugged reliability through precision engineering and robust manufacturing.</p>
          </FadeIn>

          <div className={styles.featuresGrid}>
            <FadeIn delay={0.1}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>⚙️</div>
                <h3>Uncompromising Durability</h3>
                <p>Our gearboxes and machinery are built to withstand the harshest industrial environments, ensuring maximum uptime for your operations.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Precision Engineering</h3>
                <p>From automatic SPM drills to mini VMC machines, every component is manufactured to exact tolerances for flawless performance.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏗️</div>
                <h3>Custom Solutions</h3>
                <p>We understand that every manufacturing process is unique. We provide Conveyor gearboxes and drilling solutions tailored to your specific needs.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className="container text-center">
          <FadeIn>
            <h2 className="title" style={{ color: '#fff' }}>Upgrade Your Industrial Capabilities</h2>
            <p className="subtitle" style={{ color: '#e5e7eb' }}>
              Partner with us for reliable, high-performance gearboxes and automated machinery tailored for your operational success.
            </p>
            <Link href="/contact" className="btn-primary">Contact Our Engineers Today</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
