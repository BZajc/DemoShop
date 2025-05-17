'use client';

import { useState } from 'react';
import LoginForm from '@/components/sign/LoginForm';
import RegisterForm from '@/components/sign/RegisterForm';
import Link from 'next/link';

export default function SignPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/SignBg.webp')" }}
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow p-8 space-y-6 relative overflow-hidden min-h-[420px]">
        <Link
          href="/home"
          className="absolute left-4 top-4 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          ← Back to Home
        </Link>

        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white transition-opacity duration-300">
          {mode === 'register' ? 'Create an account' : 'Welcome back'}
        </h1>

        {/* Login or register form */}
        <div className="w-full">
          {mode === 'register' && <RegisterForm />}
          {mode === 'login' && <LoginForm />}
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
            className="text-sky-600 hover:underline font-medium"
          >
            {mode === 'register' ? 'Log in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
