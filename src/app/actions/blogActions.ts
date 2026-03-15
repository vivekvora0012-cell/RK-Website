'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Blog } from '@/types';

export async function getBlogs() {
  try {
    const rs = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
    return rs.rows.map((row: any) => ({ ...row }));
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function getBlogById(id: number): Promise<Blog | null> {
  try {
    const rs = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ?',
      args: [id]
    });
    
    if (rs.rows.length === 0) return null;
    
    const row = rs.rows[0] as any;
    return {
      id: Number(row.id),
      title: String(row.title),
      excerpt: String(row.excerpt),
      content: String(row.content),
      read_time: String(row.read_time),
      image: row.image ? String(row.image) : undefined,
      created_at: String(row.created_at)
    } as Blog;
  } catch (error) {
    console.error(`Failed to fetch blog with id ${id}:`, error);
    return null;
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
