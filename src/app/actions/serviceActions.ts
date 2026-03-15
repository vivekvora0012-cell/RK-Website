'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getServices() {
  try {
    const rs = await db.execute('SELECT * FROM services ORDER BY created_at DESC');
    return rs.rows.map((row: any) => ({ ...row }));
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

export async function addService(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string || '⚙️';
  
  try {
    await db.execute({
      sql: 'INSERT INTO services (title, description, icon) VALUES (?, ?, ?)',
      args: [title, description, icon]
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
  } catch (error) {
    console.error('Failed to add service:', error);
    throw error;
  }
}

export async function deleteService(id: number) {
  try {
    await db.execute({
      sql: 'DELETE FROM services WHERE id = ?',
      args: [id]
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw error;
  }
}

export async function updateService(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string || '⚙️';
  
  try {
    await db.execute({
      sql: 'UPDATE services SET title = ?, description = ?, icon = ? WHERE id = ?',
      args: [title, description, icon, id]
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
  } catch (error) {
    console.error('Failed to update service:', error);
    throw error;
  }
}
