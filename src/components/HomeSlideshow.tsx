'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide, getSlides } from '@/app/actions/slideshowActions';
import styles from './HomeSlideshow.module.css';

export function HomeSlideshow() {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSlides() {
      const data = await getSlides();
      setSlides(data);
      setLoading(false);
    }
    loadSlides();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    const regExp = /[-\w]{25,}/;
    const match = url.match(regExp);
    const driveId = match ? match[0] : null;

    if (url.includes('drive.google.com') && driveId) {
      return `https://lh3.googleusercontent.com/d/${driveId}`;
    }
    return url;
  };

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  if (loading) return null;
  if (slides.length === 0) return null;

  return (
    <section className={styles.slideshowSection}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="title">Industrial Excellence</h2>
          <p className="subtitle">Witness our expertise in Stone Crusher Conveyor Gearboxes manufacturing and Automation Solutions.</p>
        </div>

        <div className={styles.slideshowContainer}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={styles.slide}
              style={{
                backgroundImage: `url(${getImageUrl(slide.image_url)})`,
                opacity: index === currentIndex ? 1 : 0,
                zIndex: index === currentIndex ? 1 : 0
              }}
            >
              <div className={styles.slideContent}>
                <div style={{
                  opacity: index === currentIndex ? 1 : 0,
                  transform: index === currentIndex ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-out 0.3s'
                }}>
                  <h3 className={styles.slideTitle}>{slide.title}</h3>
                  <p className={styles.slideDescription}>{slide.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Controls */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={`${styles.controlButton} ${styles.prevButton}`}
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className={`${styles.controlButton} ${styles.nextButton}`}
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className={styles.indicators}>
                {slides.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
