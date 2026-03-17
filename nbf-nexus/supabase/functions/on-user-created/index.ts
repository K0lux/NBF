// Follow this setup guide to integrate Clerk with Supabase:
// https://clerk.com/docs/integrations/databases/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { Webhook } from "https://esm.sh/svix@1.21.0"

const CLERK_WEBHOOK_SECRET = Deno.env.get("CLERK_WEBHOOK_SECRET")

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  const wh = new Webhook(CLERK_WEBHOOK_SECRET!)
  let evt: any

  try {
    evt = wh.verify(payload, headers)
  } catch (err) {
    return new Response("Invalid signature", { status: 400 })
  }

  const { id, ...attributes } = evt.data
  const eventType = evt.type

  if (eventType === "user.created") {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: id,
        clerk_id: id,
        email: attributes.email_addresses[0].email_address,
        full_name: `${attributes.first_name} ${attributes.last_name}`,
        // Set default role or metadata if needed
      })

    if (error) {
      console.error("Error creating profile:", error)
      return new Response("Error creating profile", { status: 500 })
    }

    return new Response("Profile created", { status: 201 })
  }

  return new Response("Event received", { status: 200 })
})
