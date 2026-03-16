'use client';

import * as React from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  title: string;
  url: string;
  duration?: string;
}

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getDriveId = (url: string) => {
  const regExp = /[-\w]{25,}/;
  const match = url.match(regExp);
  return match ? match[0] : null;
};

export function VideoPlayer({ title, url, duration }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const ytId = getYouTubeId(url);
  const driveId = !ytId ? getDriveId(url) : null;

  if (isPlaying) {
    let embedUrl = '';
    if (ytId) {
      // Basic embed URL for maximum reliability
      embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1`;
    } else if (driveId) {
      embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    }

    if (embedUrl) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            backgroundColor: '#000', 
            borderRadius: '0.5rem', 
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}>
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} onClick={() => setIsPlaying(true)}>
      <div style={{ 
        width: '100%', 
        aspectRatio: '16/9', 
        backgroundColor: '#111', 
        borderRadius: '0.5rem', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border-color)'
      }}>
        {/* Placeholder Thumbnail */}
        {ytId ? (
            <Image 
                src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} 
                alt={title}
                fill
                style={{ objectFit: 'cover', opacity: 0.6 }}
                unoptimized
            />
        ) : driveId ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎬</div>
                    <div style={{ fontSize: '0.8rem' }}>Drive Video Preview</div>
                </div>
            </div>
        ) : null}
        
        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          backgroundColor: 'rgba(212, 175, 55, 0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'var(--transition)',
          zIndex: 2,
          border: '2px solid rgba(255, 255, 255, 0.4)'
        }}>
          <div style={{
            width: '0',
            height: '0',
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            borderLeft: '18px solid #fff',
            marginLeft: '6px'
          }}></div>
        </div>
        
      </div>
      
    </div>
  );
}
