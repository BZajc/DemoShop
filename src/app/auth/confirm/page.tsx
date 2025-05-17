import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function ConfirmPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code

  if (!code) {
    redirect('/')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    redirect('/error')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">You're in!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your account has been confirmed. You can now log in.
        </p>
        <a
          href="/sign"
          className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Go to login
        </a>
      </div>
    </div>
  )
}
