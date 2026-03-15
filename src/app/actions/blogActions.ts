'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getBlogs() {
  try {
    const rs = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
    return rs.rows.map(row => ({ ...row }));
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function addBlog(formData: FormData) {
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const readTime = formData.get('read_time') as string || '5 min read';
  const image = formData.get('image') as string;
  
  try {
    await db.execute({
      sql: 'INSERT INTO blogs (title, excerpt, content, read_time, image) VALUES (?, ?, ?, ?, ?)',
      args: [title, excerpt, content, readTime, image]
    });
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blogs');
  } catch (error) {
    console.error('Failed to add blog:', error);
    throw error;
  }
}

export async function deleteBlog(id: number) {
  try {
    await db.execute({
      sql: 'DELETE FROM blogs WHERE id = ?',
      args: [id]
    });
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blogs');
  } catch (error) {
    console.error('Failed to delete blog:', error);
    throw error;
  }
}

export async function updateBlog(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const readTime = formData.get('read_time') as string || '5 min read';
  const image = formData.get('image') as string;
  
  try {
    await db.execute({
      sql: 'UPDATE blogs SET title = ?, excerpt = ?, content = ?, read_time = ?, image = ? WHERE id = ?',
      args: [title, excerpt, content, readTime, image, id]
    });
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blogs');
  } catch (error) {
    console.error('Failed to update blog:', error);
    throw error;
  }
}
