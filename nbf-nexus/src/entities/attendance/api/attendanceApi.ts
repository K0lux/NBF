import { Attendance, AttendanceMethod } from '../model/types';

/**
 * Service API pour gérer la présence des stagiaires.
 */
export const attendanceApi = {
  /**
   * Enregistre l'arrivée d'un stagiaire pour une séance planifiée.
   * @param scheduleId - ID de la séance planifiée.
   * @param profileId - ID du profil utilisateur Clerk.
   * @param method - Méthode de pointage (ex: QR_CODE, GEOLOCATION).
   * @param coords - Coordonnées GPS optionnelles pour la validation par zone.
   * @throws {Error} Si l'enregistrement échoue sur le serveur.
   */
  async checkIn(
    scheduleId: string, 
    profileId: string, 
    method: AttendanceMethod, 
    coords?: { lat: number; long: number }
  ): Promise<Attendance> {
    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId, profileId, method, coords }),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error checking in:', message);
      throw new Error('Failed to check in');
    }

    return (await response.json()) as Attendance;
  },

  /**
   * Enregistre le départ d'un stagiaire.
   * @param attendanceId - ID de l'enregistrement de présence existant.
   * @param method - Méthode utilisée pour le départ.
   * @param coords - Coordonnées GPS optionnelles.
   */
  async checkOut(
    attendanceId: string, 
    method: AttendanceMethod,
    coords?: { lat: number; long: number }
  ): Promise<Attendance> {
    const response = await fetch('/api/attendance', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendanceId, method, coords }),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error checking out:', message);
      throw new Error('Failed to check out');
    }

    return (await response.json()) as Attendance;
  },

  /**
   * Récupère le log de présence pour une séance spécifique.
   */
  async getAttendanceByScheduleId(scheduleId: string): Promise<Attendance | null> {
    const response = await fetch(`/api/attendance?type=by-schedule&scheduleId=${scheduleId}`)
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching attendance:', message);
      throw new Error('Failed to fetch attendance');
    }

    return (await response.json()) as Attendance | null;
  },

  /**
   * Récupère la liste des logs de présence d'un profil.
   */
  async getAttendanceByProfileId(profileId: string): Promise<Attendance[]> {
    const response = await fetch(`/api/attendance?type=by-profile&profileId=${profileId}`)
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching attendances for profile:', message);
      throw new Error('Failed to fetch profile attendances');
    }

    return (await response.json()) as Attendance[];
  },

  /**
   * Récupère l'historique de présence avec les dates de planning associées.
   */
  async getAttendanceHistoryByProfileId(profileId: string): Promise<(Attendance & { schedule: { scheduled_date: string } })[]> {
    const response = await fetch(`/api/attendance?type=history&profileId=${profileId}`)
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching attendance history:', message);
      throw new Error('Failed to fetch attendance history');
    }

    return (await response.json()) as any;
  },

  /**
   * Récupère les présences du jour (utilisé par le Dashboard Admin).
   */
  async getTodayAttendances(): Promise<(Attendance & { profile: { full_name: string; specialty: string }; schedule: { scheduled_date: string } })[]> {
    const response = await fetch('/api/attendance?type=today')
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching today\'s attendances:', message);
      throw new Error('Failed to fetch today\'s attendances');
    }

    return (await response.json()) as any;
  },

  /**
   * Filtre les présences selon plusieurs critères (dates, profil, spécialité).
   */
  async getFilteredAttendances(filters: {
    startDate?: string;
    endDate?: string;
    profileId?: string;
    specialty?: string;
  }): Promise<(Attendance & { 
    profile: { full_name: string; specialty: string }; 
    schedule: { scheduled_date: string } 
  })[]> {
    const params = new URLSearchParams({ type: 'filtered' })
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    if (filters.profileId) params.set('profileId', filters.profileId)
    if (filters.specialty) params.set('specialty', filters.specialty)

    const response = await fetch(`/api/attendance?${params.toString()}`)
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching filtered attendances:', message);
      throw new Error('Failed to fetch filtered attendances');
    }

    return (await response.json()) as any;
  },
};
