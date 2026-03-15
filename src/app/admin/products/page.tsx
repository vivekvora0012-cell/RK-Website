import { getProducts } from '@/app/actions/productActions';
import { ProductManager } from './ProductManager';

export const dynamic = 'force-dynamic';

export default async function ManageProducts() {
  const products = await getProducts() as any[];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Products</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your machinery and offerings.</p>
        </div>
      </div>

      <ProductManager initialProducts={products} />
    </div>
  );
}
