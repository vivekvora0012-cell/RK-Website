import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { getSocialLinks } from '@/app/actions/socialActions';
import { SocialLink } from '@/types';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Mail, 
  MessageCircle,
  Link as LinkIcon 
} from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
  Instagram: Instagram,
  Facebook: Facebook,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Youtube: Youtube,
  Gmail: Mail,
  WhatsApp: MessageCircle,
};

export async function Footer() {
  const socialLinks = await getSocialLinks();

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
          <div className={styles.socialGrid}>
            <Link href="/contact" className={styles.contactLink}>Contact Us</Link>
            <div className={styles.socialIcons}>
              {socialLinks.map((link: SocialLink) => {
                const Icon = IconMap[link.platform] || LinkIcon;
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={link.platform}
                    className={styles.socialIcon}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
              {socialLinks.length === 0 && (
                <>
                  <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
                  <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} R.K. Industries. All rights reserved.</p>
      </div>
    </footer>
  );
}
