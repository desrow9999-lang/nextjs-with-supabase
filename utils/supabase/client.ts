import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://mwurdtuqkgnqplaqscrg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXJkdHVxa2ducXBsYXFzY3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NTYyMTIsImV4cCI6MjEwNDEzMjIxMn0.JpcU343VYpelgIXB4V589KOc8M1ENGcWu7tVoqsUlMA'
  )
}
