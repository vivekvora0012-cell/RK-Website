'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitInquiry(formData: FormData) {
  // Honeypot check for bot prevention
  const honeypot = formData.get('website_url');
  if (honeypot) {
    console.warn('Bot submission detected via honeypot.');
    return;
  }

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;
  const interest = formData.get('service') as string;

  // Basic server-side validation
  if (!firstName || !lastName || !email || !phone || !message) {
    throw new Error('All mandatory fields must be provided.');
  }

  if (message.length < 10) {
    throw new Error('Message must be at least 10 characters long.');
  }
  
  const name = `${firstName} ${lastName}`.trim();
  const fullMessage = `[Interest: ${interest}] ${message}`;

  await db.execute({
    sql: 'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)',
    args: [name, email, phone, fullMessage]
  });
  
  revalidatePath('/admin/inquiries');
}

export async function getInquiries() {
  const rs = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
  return rs.rows;
}

export async function markInquiryAsRead(id: number) {
  await db.execute({
    sql: 'UPDATE inquiries SET is_read = 1 WHERE id = ?',
    args: [id]
  });
  revalidatePath('/admin/inquiries');
}

export async function deleteInquiry(id: number) {
  await db.execute({
    sql: 'DELETE FROM inquiries WHERE id = ?',
    args: [id]
  });
  revalidatePath('/admin/inquiries');
}
