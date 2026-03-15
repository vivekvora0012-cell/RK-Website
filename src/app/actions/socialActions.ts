'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSocialLinks() {
  const rs = await db.execute('SELECT * FROM social_links ORDER BY order_index ASC, created_at DESC');
  return rs.rows.map(row => ({
    id: Number(row.id),
    platform: String(row.platform),
    url: String(row.url),
    order_index: Number(row.order_index),
    created_at: String(row.created_at)
  }));
}

export async function addSocialLink(formData: FormData) {
  const platform = formData.get('platform') as string;
  const url = formData.get('url') as string;
  const order_index = Number(formData.get('order_index') || 0);

  await db.execute({
    sql: 'INSERT INTO social_links (platform, url, order_index) VALUES (?, ?, ?)',
    args: [platform, url, order_index]
  });

  revalidatePath('/');
  revalidatePath('/admin/social');
}

export async function updateSocialLink(id: number, formData: FormData) {
  const platform = formData.get('platform') as string;
  const url = formData.get('url') as string;
  const order_index = Number(formData.get('order_index') || 0);

  await db.execute({
    sql: 'UPDATE social_links SET platform = ?, url = ?, order_index = ? WHERE id = ?',
    args: [platform, url, order_index, id]
  });

  revalidatePath('/');
  revalidatePath('/admin/social');
}

export async function deleteSocialLink(id: number) {
  await db.execute({
    sql: 'DELETE FROM social_links WHERE id = ?',
    args: [id]
  });

  revalidatePath('/');
  revalidatePath('/admin/social');
}
