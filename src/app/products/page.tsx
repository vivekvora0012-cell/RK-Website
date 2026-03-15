import { FadeIn } from '@/components/FadeIn';
import { ProductCard } from '@/components/ProductCard';
import db from '@/lib/db';
import styles from './products.module.css';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const rs = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
  const dbProducts = rs.rows;
  return dbProducts.map((p: any) => ({
    ...p,
    id: Number(p.id),
    name: String(p.name),
    price: String(p.price),
    description: String(p.description),
    serial_no: p.serial_no ? String(p.serial_no) : undefined,
    model_no: p.model_no ? String(p.model_no) : undefined,
    ratio: p.ratio ? String(p.ratio) : undefined,
    images: String(p.images),
    created_at: String(p.created_at)
  })) as Product[];
}

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="container section">
      <FadeIn>
        <h1 className={`${styles.productTitle} title`}>Our Industrial Machinery</h1>
        <p className="subtitle text-center">Engineered for durability. Built for performance.</p>
      </FadeIn>

      <div className={styles.productsGrid}>
        {products.map((product, index) => {
          let imgArray: string[] = [];
          try {
            const images = product.images;
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
            <FadeIn key={product.id} delay={index * 0.15}>
              <ProductCard 
                id={product.id}
                name={product.name}
                price={product.price}
                desc={product.description}
                serial_no={product.serial_no}
                model_no={product.model_no}
                ratio={product.ratio}
                images={imgArray}
              />
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
