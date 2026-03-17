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
            const clerkToken = await getToken({ template: "supabase" })

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
