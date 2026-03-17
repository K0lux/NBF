"use client"

import * as React from "react"
import { Button } from "@/shared/ui/button"
import { traineeApi } from "@/entities/trainee/api/traineeApi"
import { toast } from "sonner"
import { Shield, ShieldAlert, Loader2 } from "lucide-react"

interface RoleToggleProps {
  traineeId: string;
  currentRole: 'admin' | 'trainee';
  onSuccess?: () => void;
}

export function RoleToggle({ traineeId, currentRole, onSuccess }: RoleToggleProps) {
  const [loading, setLoading] = React.useState(false)

  const handleToggle = async () => {
    const newRole = currentRole === 'admin' ? 'trainee' : 'admin'
    setLoading(true)
    try {
      await traineeApi.updateTraineeRole(traineeId, newRole)
      toast.success(`Role updated to ${newRole}`)
      onSuccess?.()
    } catch (err) {
      toast.error("Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggle} 
      disabled={loading}
      className={currentRole === 'admin' ? "text-orange-600" : "text-blue-600"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : currentRole === 'admin' ? (
        <>
          <ShieldAlert className="mr-2 h-4 w-4" />
          Make Trainee
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Make Admin
        </>
      )}
    </Button>
  )
}
