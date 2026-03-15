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
    
    if (rs.rows.length === 0) {
      // Fallback for placeholder blogs (IDs 1, 2, 3)
      const fallbacks: Record<number, Blog> = {
        1: {
          id: 1,
          title: 'The Future of Minimalist Design',
          excerpt: 'Exploring how removing the unnecessary focuses attention and drives business value in modern web architecture.',
          created_at: '2026-04-10',
          read_time: '5 min read',
          content: 'This is a placeholder content for the first blog post. In a world increasingly cluttered with digital noise, minimalism isn\'t just an aesthetic choice—it\'s a strategic business decision. By stripping away non-essential elements, you focus your user\'s attention on what truly matters: your value proposition.',
          image: undefined
        },
        2: {
          id: 2,
          title: 'Why Dark Mode is More Than a Trend',
          excerpt: 'Deep dive into the ergonomic, aesthetic, and battery-saving benefits of shipping premium dark mode experiences.',
          created_at: '2026-03-28',
          read_time: '4 min read',
          content: 'Dark mode has transitioned from a developer preference to a global user expectation. Beyond the obvious battery-saving benefits for OLED screens, it offers a reduced cognitive load in low-light environments and a sophisticated, premium feel for high-end brands.',
          image: undefined
        },
        3: {
          id: 3,
          title: 'Building Royal Digital Experiences',
          excerpt: 'A case study on how we utilized a refined color palette and stark typography to increase engagement by 300%.',
          created_at: '2026-02-15',
          read_time: '8 min read',
          content: 'True luxury is found in the details. When we rebuilt the R.K. Industries digital platform, we focused on intentionality. Every gradient transiton, every font choice, and every millisecond of animation was designed to project authority and reliability.',
          image: undefined
        }
      };
      return fallbacks[id] || null;
    }
    
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
