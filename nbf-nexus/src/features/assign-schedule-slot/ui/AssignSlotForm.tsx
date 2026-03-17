"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { traineeApi } from "@/entities/trainee/api/traineeApi"
import { scheduleApi } from "@/entities/schedule/api/scheduleApi"
import { Trainee } from "@/entities/trainee/model/types"
import { useQuery } from "@tanstack/react-query"

const formSchema = z.object({
  traineeId: z.string({
    required_error: "Please select a trainee.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
})

interface AssignSlotFormProps {
  onSuccess: () => void
  initialDate?: Date
}

export function AssignSlotForm({ onSuccess, initialDate }: AssignSlotFormProps) {
  const { data: trainees, isLoading: isLoadingTrainees } = useQuery({
    queryKey: ["trainees"],
    queryFn: traineeApi.getTrainees,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialDate || new Date(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedDate = format(values.date, "yyyy-MM-dd")
      await scheduleApi.createScheduleEntry(values.traineeId, formattedDate)
      toast.success("Schedule entry created successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to create schedule entry. Maybe trainee is already assigned for this day?")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="traineeId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Trainee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingTrainees ? "Loading..." : "Select a trainee"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainees?.map((trainee) => (
                    <SelectItem key={trainee.id} value={trainee.id}>
                      {trainee.full_name} ({trainee.specialty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Assigning..." : "Assign Slot"}
        </Button>
      </form>
    </Form>
  )
}
