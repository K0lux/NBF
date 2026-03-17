"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { AssignSlotForm } from "./AssignSlotForm"

interface AssignSlotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialDate?: Date
}

export function AssignSlotModal({ 
  open, 
  onOpenChange, 
  onSuccess, 
  initialDate 
}: AssignSlotModalProps) {
  
  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Trainee Slot</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AssignSlotForm onSuccess={handleSuccess} initialDate={initialDate} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
