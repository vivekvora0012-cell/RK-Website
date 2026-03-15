'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions/auth';
import { Lock } from 'lucide-react';
import styles from './login.module.css';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`btn-primary ${styles.submitButton}`}
    >
      {pending ? 'Authenticating...' : 'Access Dashboard'}
    </button>
  );
}

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.iconWrapper}>
            <Lock size={32} />
          </div>
          <h1>Admin Portal</h1>
          <p>R.K. Industries Restricted Access</p>
        </div>

        <form action={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Administrator Password</label>
            <input 
              type="password" 
              id="password"
              name="password"
              placeholder="Enter your secure key"
              required 
              className={styles.inputField}
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
