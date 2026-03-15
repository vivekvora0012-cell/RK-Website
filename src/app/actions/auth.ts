'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password');
  
  if (password === process.env.ADMIN_PASSWORD) {
    // Set a secure HttpOnly cookie. Max age 24 hours.
    (await cookies()).set('admin_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, 
      path: '/',
      sameSite: 'strict',
    });
    
    // Redirect to the dashboard
    redirect('/admin');
  }
  
  return { error: 'Invalid password' };
}

export async function logout() {
  (await cookies()).delete('admin_auth');
  redirect('/admin/login');
}
