import { FadeIn } from '@/components/FadeIn';
import { ProductCard } from '@/components/ProductCard';
import db from '@/lib/db';
import styles from './products.module.css';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const rs = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
  const dbProducts = rs.rows;
  return dbProducts.map((p: unknown) => {
    const row = p as Record<string, unknown>;
    return {
      id: Number(row.id),
      name: String(row.name),
      price: String(row.price),
      description: String(row.description),
      serial_no: row.serial_no ? String(row.serial_no) : undefined,
      model_no: row.model_no ? String(row.model_no) : undefined,
      ratio: row.ratio ? String(row.ratio) : undefined,
      images: String(row.images),
      created_at: String(row.created_at)
    };
  }) as Product[];
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
