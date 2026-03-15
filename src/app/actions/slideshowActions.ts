'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface Slide {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export async function getSlides(): Promise<Slide[]> {
  try {
    const rs = await db.execute('SELECT * FROM slideshow ORDER BY order_index ASC, created_at DESC');
    return rs.rows.map((row: any) => ({ ...row })) as unknown as Slide[];
  } catch (error) {
    console.error('Failed to fetch slides:', error);
    return [];
  }
}

export async function addSlide(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image_url = formData.get('image_url') as string;
  const order_index = parseInt(formData.get('order_index') as string || '0');

  try {
    await db.execute({
      sql: 'INSERT INTO slideshow (title, description, image_url, order_index) VALUES (?, ?, ?, ?)',
      args: [title, description, image_url, order_index]
    });

    revalidatePath('/');
    revalidatePath('/admin/slideshow');
  } catch (error) {
    console.error('Failed to add slide:', error);
    throw error;
  }
}

export async function updateSlide(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image_url = formData.get('image_url') as string;
  const order_index = parseInt(formData.get('order_index') as string || '0');

  try {
    await db.execute({
      sql: 'UPDATE slideshow SET title = ?, description = ?, image_url = ?, order_index = ? WHERE id = ?',
      args: [title, description, image_url, order_index, id]
    });

    revalidatePath('/');
    revalidatePath('/admin/slideshow');
  } catch (error) {
    console.error('Failed to update slide:', error);
    throw error;
  }
}

export async function deleteSlide(id: number) {
  try {
    await db.execute({
      sql: 'DELETE FROM slideshow WHERE id = ?',
      args: [id]
    });

    revalidatePath('/');
    revalidatePath('/admin/slideshow');
  } catch (error) {
    console.error('Failed to delete slide:', error);
    throw error;
  }
}
