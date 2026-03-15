'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  try {
    const rs = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
    return rs.rows.map((row: any) => ({ ...row }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const serialNo = formData.get('serial_no') as string || '';
  const modelNo = formData.get('model_no') as string || '';
  const ratio = formData.get('ratio') as string || '';

  const imagesRaw = formData.get('images') as string || '';
  const urlRegex = /(https?:\/\/[^\s,;'"|<>]+)/g;
  const imagesArray = imagesRaw.match(urlRegex) || [];
  const imagesJson = JSON.stringify(imagesArray.map((url: string) => url.trim()));
  
  try {
    await db.execute({
      sql: `
        INSERT INTO products (name, price, description, serial_no, model_no, ratio, images) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [name, price, description, serialNo, modelNo, ratio, imagesJson]
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
  } catch (error) {
    console.error('Failed to add product:', error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const serialNo = formData.get('serial_no') as string || '';
  const modelNo = formData.get('model_no') as string || '';
  const ratio = formData.get('ratio') as string || '';
  
  const imagesRaw = formData.get('images') as string || '';
  const urlRegex = /(https?:\/\/[^\s,;'"|<>]+)/g;
  const imagesArray = imagesRaw.match(urlRegex) || [];
  const imagesJson = JSON.stringify(imagesArray.map((url: string) => url.trim()));
  
  try {
    await db.execute({
      sql: `
        UPDATE products 
        SET name = ?, price = ?, description = ?, serial_no = ?, model_no = ?, ratio = ?, images = ?
        WHERE id = ?
      `,
      args: [name, price, description, serialNo, modelNo, ratio, imagesJson, id]
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}
