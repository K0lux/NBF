"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trainee } from "@/entities/trainee/model/types"
import { TraineeAvatar } from "@/entities/trainee/ui/TraineeAvatar"
import { EditTraineeModal } from "@/features/edit-trainee/ui/EditTraineeModal"
import { RoleToggle } from "@/features/edit-trainee/ui/RoleToggle"
import { Badge } from "@/shared/ui/badge"

export const getColumns = (onRefresh: () => void): ColumnDef<Trainee>[] => [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <TraineeAvatar fullName={row.getValue("full_name")} />
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "specialty",
    header: "Specialty",
  },
  {
    accessorKey: "intern_type",
    header: "Type",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const trainee = row.original
      return (
        <div className="flex items-center gap-2">
          <Badge variant={trainee.role === 'admin' ? "secondary" : "outline"}>
            {trainee.role}
          </Badge>
          <RoleToggle 
            traineeId={trainee.id} 
            currentRole={trainee.role} 
            onSuccess={onRefresh} 
          />
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trainee = row.original
      return (
        <div className="text-right">
          <EditTraineeModal trainee={trainee} onSuccess={onRefresh} />
        </div>
      )
    },
  },
]
