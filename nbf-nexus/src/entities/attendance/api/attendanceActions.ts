"use server"

import { verifyAttendanceToken } from "../lib/attendanceTokens"
import { attendanceApi } from "./attendanceApi"
import { Attendance } from "../model/types"
import { WORKSPACE_CONFIG, calculateDistance } from "@/shared/config/attendance"

export async function processCheckInAction(
  token: string, 
  coords?: { lat: number; long: number }
): Promise<{ success: boolean; data?: Attendance; error?: string }> {
  try {
    const payload = await verifyAttendanceToken(token)
    
    if (!payload) {
      return { success: false, error: "Invalid or expired token" }
    }

    const { scheduleId, profileId } = payload

    // Advanced Geofencing: Strict check if coordinates are provided
    if (coords) {
      const distance = calculateDistance(
        coords.lat, 
        coords.long, 
        WORKSPACE_CONFIG.LATITUDE, 
        WORKSPACE_CONFIG.LONGITUDE
      );

      if (distance > WORKSPACE_CONFIG.RADIUS_METERS) {
        return { 
          success: false, 
          error: `Geofencing check failed. You are ${Math.round(distance)}m away from the workspace (max ${WORKSPACE_CONFIG.RADIUS_METERS}m allowed).` 
        };
      }
    } else {
      // In production, we might want to mandate coordinates
      // return { success: false, error: "Location required for check-in" }
    }
    
    // Check-in via QR_CODE (optionally with coordinates)
    const attendance = await attendanceApi.checkIn(scheduleId, profileId, "QR_CODE", coords)
    
    return { success: true, data: attendance }
  } catch (err) {
    console.error("Check-in action failed:", err)
    return { success: false, error: "Check-in failed" }
  }
}
