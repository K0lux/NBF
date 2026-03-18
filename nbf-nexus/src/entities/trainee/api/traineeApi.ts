import { Trainee } from '../model/types';

export interface TraineeGroup {
  id: string;
  name: string;
  description: string | null;
  trainee_group_members?: Array<{ profile_id: string }>;
}

export const traineeApi = {
  async getTrainees(includeArchived = false): Promise<Trainee[]> {
    const response = await fetch(`/api/trainees?includeArchived=${includeArchived ? "true" : "false"}`)
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching trainees:', message);
      throw new Error('Failed to fetch trainees');
    }

    return (await response.json()) as Trainee[];
  },

  async updateTraineeMetadata(id: string, updates: Partial<Trainee>): Promise<Trainee> {
    const response = await fetch(`/api/trainees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error('Error updating trainee:', message);
      throw new Error('Failed to update trainee');
    }

    return (await response.json()) as Trainee;
  },

  async updateTraineeRole(id: string, role: 'admin' | 'trainee'): Promise<Trainee> {
    const response = await fetch(`/api/trainees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error('Error updating trainee role:', message);
      throw new Error('Failed to update trainee role');
    }

    return (await response.json()) as Trainee;
  },

  async bulkUpdate(ids: string[], action: string, payload: Record<string, unknown> = {}) {
    const response = await fetch('/api/trainees/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, action, ...payload }),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error bulk updating trainees:', message);
      throw new Error(message || 'Failed to bulk update trainees')
    }
    return response.json()
  },

  async getGroups(): Promise<TraineeGroup[]> {
    const response = await fetch('/api/trainee-groups')
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching groups:', message);
      throw new Error('Failed to fetch groups')
    }
    return response.json()
  },

  async createGroup(name: string, description: string, memberIds: string[]) {
    const response = await fetch('/api/trainee-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, memberIds }),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error creating group:', message);
      throw new Error('Failed to create group')
    }
    return response.json()
  },

  async updateGroupMembers(groupId: string, memberIds: string[], mode: "replace" | "add" | "remove" = "replace") {
    const response = await fetch(`/api/trainee-groups/${groupId}/members`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberIds, mode }),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error updating group members:', message);
      throw new Error('Failed to update group members')
    }
    return response.json()
  },

  async sendMessage(payload: {
    channels: string[];
    subject?: string;
    message: string;
    groupId?: string;
    recipientIds?: string[];
  }) {
    const response = await fetch('/api/trainee-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error sending messages:', message);
      throw new Error(message || 'Failed to send messages')
    }
    return response.json()
  },
};
