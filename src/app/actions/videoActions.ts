'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getVideos() {
  const rs = await db.execute('SELECT * FROM videos ORDER BY created_at DESC');
  return rs.rows;
}

export async function addVideo(formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const duration = formData.get('duration') as string || '0:00';
  
  await db.execute({
    sql: 'INSERT INTO videos (title, url, duration) VALUES (?, ?, ?)',
    args: [title, url, duration]
  });
  
  revalidatePath('/admin/videos');
  revalidatePath('/videos');
}

export async function deleteVideo(id: number) {
  await db.execute({
    sql: 'DELETE FROM videos WHERE id = ?',
    args: [id]
  });
  
  revalidatePath('/admin/videos');
  revalidatePath('/videos');
}

export async function updateVideo(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const duration = formData.get('duration') as string || '0:00';
  
  await db.execute({
    sql: 'UPDATE videos SET title = ?, url = ?, duration = ? WHERE id = ?',
    args: [title, url, duration, id]
  });
  
  revalidatePath('/admin/videos');
  revalidatePath('/videos');
}
