'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getVideos() {
  try {
    const rs = await db.execute('SELECT * FROM videos ORDER BY created_at DESC');
    return rs.rows.map(row => ({ ...row }));
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return [];
  }
}

export async function addVideo(formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const duration = formData.get('duration') as string || '0:00';
  
  try {
    await db.execute({
      sql: 'INSERT INTO videos (title, url, duration) VALUES (?, ?, ?)',
      args: [title, url, duration]
    });
    
    revalidatePath('/admin/videos');
    revalidatePath('/videos');
  } catch (error) {
    console.error('Failed to add video:', error);
    throw error;
  }
}

export async function deleteVideo(id: number) {
  try {
    await db.execute({
      sql: 'DELETE FROM videos WHERE id = ?',
      args: [id]
    });
    
    revalidatePath('/admin/videos');
    revalidatePath('/videos');
  } catch (error) {
    console.error('Failed to delete video:', error);
    throw error;
  }
}

export async function updateVideo(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const duration = formData.get('duration') as string || '0:00';
  
  try {
    await db.execute({
      sql: 'UPDATE videos SET title = ?, url = ?, duration = ? WHERE id = ?',
      args: [title, url, duration, id]
    });
    
    revalidatePath('/admin/videos');
    revalidatePath('/videos');
  } catch (error) {
    console.error('Failed to update video:', error);
    throw error;
  }
}
