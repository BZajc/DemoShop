'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email not confirmed. Check your inbox.' }
    }

    return { error: 'Unexpected error. Please try again later.' }
  }

  revalidatePath('/home', 'layout')
  redirect('/home')
}
