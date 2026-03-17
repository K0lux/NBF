"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Trainee } from "@/entities/trainee/model/types"
import { EditTraineeForm } from "./EditTraineeForm"
import { Edit } from "lucide-react"

interface EditTraineeModalProps {
  trainee: Trainee
  onSuccess: () => void
}

export function EditTraineeModal({ trainee, onSuccess }: EditTraineeModalProps) {
  const [open, setOpen] = React.useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Trainee: {trainee.full_name}</DialogTitle>
        </DialogHeader>
        <EditTraineeForm trainee={trainee} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
