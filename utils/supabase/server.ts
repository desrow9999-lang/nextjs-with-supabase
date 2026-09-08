import { createServerClient } from '@ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    'https://mwurdtuqkgnqplaqscrg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXJkdHVxa2ducXBsYXFzY3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NTYyMTIsImV4cCI6MjEwNDEzMjIxMn0.JpcU343VYpelgIXB4V589KOc8M1ENGcWu7tVoqsUlMA',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
