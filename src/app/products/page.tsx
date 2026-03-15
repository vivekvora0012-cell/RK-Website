import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';
import { ProductCard } from '@/components/ProductCard';
import db from '@/lib/db';
import styles from './products.module.css';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const rs = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
  const products = rs.rows;

  return (
    <div className="container section">
      <FadeIn>
        <h1 className={`${styles.productTitle} title`}>Our Industrial Machinery</h1>
        <p className="subtitle text-center">Engineered for durability. Built for performance.</p>
      </FadeIn>

      <div className={styles.productsGrid}>
        {products.map((productRow, index) => {
          const product = productRow as any;
          let imgArray: string[] = [];
          try {
            const images = product.images as string | null;
            if (images) {
              if (images.startsWith('[') && images.endsWith(']')) {
                imgArray = JSON.parse(images);
              } else {
                const urlRegex = /(https?:\/\/[^\s,;'"|<>]+)/g;
                imgArray = images.match(urlRegex) || [];
              }
            }
          } catch (e) {
            console.error('Error parsing product images:', e);
          }
          return (
            <FadeIn key={Number(product.id)} delay={index * 0.15}>
              <ProductCard 
                id={Number(product.id)}
                name={String(product.name)}
                price={String(product.price)}
                desc={String(product.description)}
                serial_no={product.serial_no ? String(product.serial_no) : undefined}
                model_no={product.model_no ? String(product.model_no) : undefined}
                ratio={product.ratio ? String(product.ratio) : undefined}
                images={imgArray}
              />
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
