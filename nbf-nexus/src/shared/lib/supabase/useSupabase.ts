"use client"

import { useAuth } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/shared/config/env"
import * as React from "react"

/**
 * Custom hook to get an authenticated Supabase client.
 * It uses Clerk's getToken to fetch a JWT and sets it in the Supabase client headers.
 */
export function useSupabase() {
  const { getToken } = useAuth()

  return React.useMemo(() => {
    return createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          fetch: async (url, options = {}) => {
            let clerkToken: string | null = null
            const jwtTemplate = env.NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE

            if (jwtTemplate) {
              try {
                clerkToken = await getToken({ template: jwtTemplate })
              } catch {
                clerkToken = await getToken()
              }
            } else {
              clerkToken = await getToken()
            }

            const headers = new Headers(options.headers)
            if (clerkToken) {
              headers.set("Authorization", `Bearer ${clerkToken}`)
            }

            return fetch(url, {
              ...options,
              headers,
            })
          },
        },
      }
    )
  }, [getToken])
}
