"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trainee } from "@/entities/trainee/model/types"
import { TraineeAvatar } from "@/entities/trainee/ui/TraineeAvatar"
import { EditTraineeModal } from "@/features/edit-trainee/ui/EditTraineeModal"
import { RoleToggle } from "@/features/edit-trainee/ui/RoleToggle"
import { Badge } from "@/shared/ui/badge"

export const getColumns = (onRefresh: () => void): ColumnDef<Trainee>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.target.checked)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "access_level",
    header: "Access",
    cell: ({ row }) => row.original.access_level || "trainee",
  },
  {
    id: "remaining",
    header: "Remaining",
    cell: ({ row }) => {
      const endDate = row.original.end_date
      if (!endDate) return "N/A"
      const end = new Date(endDate)
      const now = new Date()
      const diffMs = end.getTime() - now.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays < 0) return "Finished"
      const months = Math.floor(diffDays / 30)
      const days = diffDays % 30
      return `${months}m ${days}d`
    },
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
