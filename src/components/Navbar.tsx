'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield } from 'lucide-react';
import styles from './Navbar.module.css';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Videos', href: '/videos' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logoWrapper} onClick={closeMenu}>
          <Image
            src="/logo.png"
            alt="R.K. Industries Logo"
            width={180}
            height={60}
            className={styles.logoImage}
            priority
          />
        </Link>

        {/* Desktop Links */}
        <ul className={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>

        <div className={styles.navActions}>
          <Link href="/admin" className="btn-outline">Admin Panel</Link>
          
          <button className={styles.menuButton} onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} onClick={closeMenu} />
      <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={styles.mobileLink}
            onClick={closeMenu}
          >
            {item.name}
          </Link>
        ))}
        <Link 
          href="/admin" 
          className={`${styles.mobileLink} ${styles.mobileAdminLink}`}
          onClick={closeMenu}
        >
          <Shield size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Admin Panel
        </Link>
      </div>
    </nav>
  );
}
