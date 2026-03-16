'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  desc: string;
  serial_no?: string;
  model_no?: string;
  ratio?: string;
  images?: string[]; // Array of Google Drive links
}

function getDriveImageId(url: string) {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getImageUrl(url: string) {
  const id = getDriveImageId(url);
  // Using the Google Drive thumbnail endpoint as it is the most reliable way 
  // to display Drive images in an <img> tag without cross-origin issues.
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : url;
}

export function ProductCard({ name, price, desc, serial_no, model_no, ratio, images }: ProductCardProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [failedImages, setFailedImages] = React.useState<Record<number, boolean>>({});
  
  const hasSpecs = serial_no || model_no || ratio;
  
  // Prepare valid image URLs
  const validImageUrls = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.map(getImageUrl);
  }, [images]);

  const handleImgError = (idx: number) => {
    setFailedImages(prev => ({ ...prev, [idx]: true }));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % validImageUrls.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? validImageUrls.length - 1 : prev - 1));
  };

  return (
    <div 
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '0.75rem', 
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Slideshow Hero Section */}
      {validImageUrls.length > 0 ? (
        <div style={{ width: '100%', height: '350px', backgroundColor: '#0a0a0a', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
          {!failedImages[currentSlide] ? (
            <Image 
              src={validImageUrls[currentSlide]} 
              alt={`${name} - Slide ${currentSlide + 1}`} 
              onError={() => handleImgError(currentSlide)}
              fill
              style={{ objectFit: 'contain', transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)' }} 
              className="product-img"
              unoptimized
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '2rem', textAlign: 'center', backgroundColor: '#111' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>📷</div>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Photo unavailable</span>
              <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Checking permissions or file status...</p>
            </div>
          )}
          
          {/* Photo Counter */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.85)', color: 'var(--accent-primary)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', zIndex: 45, border: '1px solid var(--accent-primary)', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            {validImageUrls.length > 1 ? `${currentSlide + 1} / ${validImageUrls.length}` : '1 / 1'}
          </div>

          {/* Full Image Label */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', zIndex: 40, border: '1px solid rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Full Machinery View
          </div>
          
          {/* Slideshow Controls */}
          {validImageUrls.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                style={{ 
                  position: 'absolute', 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  backgroundColor: 'var(--accent-primary)', 
                  color: 'white', 
                  border: '2px solid white', 
                  borderRadius: '50%', 
                  width: '42px', 
                  height: '42px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  zIndex: 50,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.6)'
                }}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button 
                onClick={nextSlide}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  backgroundColor: 'var(--accent-primary)', 
                  color: 'white', 
                  border: '2px solid white', 
                  borderRadius: '50%', 
                  width: '42px', 
                  height: '42px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  zIndex: 50,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.6)'
                }}
                aria-label="Next image"
              >
                &#8250;
              </button>
              
              {/* Thumbnail Strip Overlay */}
              <div style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0', 
                height: '75px', 
                backgroundColor: 'rgba(0,0,0,0.92)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                padding: '0 20px',
                zIndex: 40,
                borderTop: '2px solid var(--accent-primary)',
                backdropFilter: 'blur(10px)'
              }}>
                {validImageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '8px',
                      border: currentSlide === idx ? '3px solid var(--accent-primary)' : `1px solid ${failedImages[idx] ? "#ef4444" : "rgba(255,255,255,0.4)"}`,
                      padding: 0,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: currentSlide === idx ? 1 : 0.4,
                      transition: 'all 0.3s ease',
                      backgroundColor: failedImages[idx] ? '#222' : '#111',
                      transform: currentSlide === idx ? 'scale(1.15) translateY(-3px)' : 'scale(1)',
                      boxShadow: currentSlide === idx ? '0 5px 15px rgba(212, 175, 55, 0.4)' : 'none'
                    }}
                  >
                    {!failedImages[idx] ? (
                      <Image src={url} alt="" fill onError={() => handleImgError(idx)} style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '10px' }}>!</div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ width: '100%', height: '150px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'Playfair Display', fontStyle: 'italic' }}>No Image provided</span>
        </div>
      )}

      {/* Content Section */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)' }}>{name}</h3>
        
        {hasSpecs && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', margin: '1rem 0', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            {model_no && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{model_no}</div>
              </div>
            )}
            {serial_no && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Serial No</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{serial_no}</div>
              </div>
            )}
            {ratio && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ratio</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ratio}</div>
              </div>
            )}
          </div>
        )}

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', flexGrow: 1 }}>{desc}</p>
        
        <div className="product-footer" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '1rem', 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span className="product-price" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{price}</span>
          <div className="product-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/contact" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Inquire</Link>
          </div>
          
          <style jsx>{`
            @media (max-width: 600px) {
              .product-footer {
                flex-direction: column;
                justify-content: center;
                text-align: center;
              }
              .product-actions {
                width: 100%;
                justify-content: center;
              }
              .product-actions :global(a) {
                width: 100%;
                text-align: center;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
