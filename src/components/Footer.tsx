import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerSection}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/logo.png" 
              alt="R.K. Industries Logo" 
              width={200} 
              height={70} 
              className={styles.logoImage}
            />
          </div>
          <p className={styles.description}>
            Providing modern, sleek, and royal experiences. We are dedicated to excellence and minimalist design.
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/products">Our Products</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            <li><Link href="/blogs">Latest Blogs</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Connect</h4>
          <ul>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/videos">Videos</Link></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} R.K. Industries. All rights reserved.</p>
      </div>
    </footer>
  );
}
