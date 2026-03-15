'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getServices() {
  const rs = await db.execute('SELECT * FROM services ORDER BY created_at DESC');
  return rs.rows.map(row => ({ ...row }));
}

export async function addService(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string || '⚙️';
  
  await db.execute({
    sql: 'INSERT INTO services (title, description, icon) VALUES (?, ?, ?)',
    args: [title, description, icon]
  });
  
  revalidatePath('/admin/services');
  revalidatePath('/services');
}

export async function deleteService(id: number) {
  await db.execute({
    sql: 'DELETE FROM services WHERE id = ?',
    args: [id]
  });
  
  revalidatePath('/admin/services');
  revalidatePath('/services');
}

export async function updateService(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string || '⚙️';
  
  await db.execute({
    sql: 'UPDATE services SET title = ?, description = ?, icon = ? WHERE id = ?',
    args: [title, description, icon, id]
  });
  
  revalidatePath('/admin/services');
  revalidatePath('/services');
}
