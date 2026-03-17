"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/shared/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { requestApi } from "@/entities/request/api/requestApi"
import { RequestType } from "@/entities/request/model/types"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { useSupabase } from "@/shared/lib/supabase/useSupabase"

const formSchema = z.object({
  type: z.enum(["SCHEDULE_CHANGE", "PRESENTATION_SLOT"]),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  targetDate: z.string().optional(),
})

interface CreateRequestFormProps {
  profileId: string
  onSuccess?: () => void
}

export function CreateRequestForm({ profileId, onSuccess }: CreateRequestFormProps) {
  const [loading, setLoading] = React.useState(false)
  const { t } = useI18n()
  const supabase = useSupabase()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "SCHEDULE_CHANGE",
      title: "",
      description: "",
      targetDate: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      await requestApi.createRequest(
        supabase,
        profileId,
        values.type as RequestType,
        values.title,
        values.description,
        { targetDate: values.targetDate }
      )
      toast.success(t("success_message"))
      form.reset()
      onSuccess?.()
    } catch {
      toast.error(t("error_message"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("request_type")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("request_type")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SCHEDULE_CHANGE">{t("schedule_change")}</SelectItem>
                  <SelectItem value="PRESENTATION_SLOT">{t("presentation_slot")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("title")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("target_date_optional")}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>{t("target_date_description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("detailed_description")}</FormLabel>
              <FormControl>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t("explain_reason")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("submit_request_button")}
        </Button>
      </form>
    </Form>
  )
}
