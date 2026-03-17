"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Trainee, Specialty, InternType } from "@/entities/trainee/model/types"
import { traineeApi } from "@/entities/trainee/api/traineeApi"

const formSchema = z.object({
  specialty: z.enum(["DEV", "AI", "NET_SEC"]),
  intern_type: z.enum(["ON_SITE", "REMOTE", "HYBRID"]),
})

interface EditTraineeFormProps {
  trainee: Trainee
  onSuccess: () => void
}

export function EditTraineeForm({ trainee, onSuccess }: EditTraineeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: trainee.specialty || "DEV",
      intern_type: trainee.intern_type || "ON_SITE",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await traineeApi.updateTraineeMetadata(trainee.id, values)
      toast.success("Trainee updated successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to update trainee")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DEV">Development</SelectItem>
                  <SelectItem value="AI">Artificial Intelligence</SelectItem>
                  <SelectItem value="NET_SEC">Network & Security</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="intern_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internship Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ON_SITE">On-site</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
