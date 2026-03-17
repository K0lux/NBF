import fs from 'fs/promises';
import path from 'path';

export interface UserContext {
  role: 'admin' | 'trainee';
  userId: string;
  fullName?: string;
}

export class ContextManager {
  private static STORAGE_PATH = path.join(process.cwd(), 'storage', 'ai', 'contexts');

  /**
   * Loads the base context for a specific role and the individual user memory if it exists.
   */
  static async getUserContext(user: UserContext): Promise<string> {
    const roleFile = user.role === 'admin' ? 'admin_base.md' : 'trainee_base.md';
    const rolePath = path.join(this.STORAGE_PATH, roleFile);
    const userPath = path.join(this.STORAGE_PATH, `user_${user.userId}.md`);

    let fullContext = '';

    try {
      const baseContent = await fs.readFile(rolePath, 'utf-8');
      fullContext += baseContent + '\n\n';
    } catch (err) {
      console.error('Failed to load base context:', err);
    }

    fullContext += `## Current User Context\n- User ID: ${user.userId}\n- Name: ${user.fullName || 'Trainee'}\n- Role: ${user.role}\n\n`;

    try {
      const userContent = await fs.readFile(userPath, 'utf-8');
      fullContext += `## Historical User Context & Memory\n${userContent}`;
    } catch (err) {
      // User memory file may not exist yet, which is fine
    }

    return fullContext;
  }

  /**
   * Persists a key piece of information to the user's individual context file.
   * This is like "long-term memory" inspired by systems like OpenClaw.
   */
  static async saveUserMemory(userId: string, memorySnippet: string): Promise<void> {
    const userPath = path.join(this.STORAGE_PATH, `user_${userId}.md`);
    const timestamp = new Date().toISOString();
    const formattedSnippet = `\n### [Memory Log - ${timestamp}]\n${memorySnippet}\n`;

    try {
      await fs.appendFile(userPath, formattedSnippet, 'utf-8');
    } catch (err) {
      console.error('Failed to save user memory:', err);
    }
  }
}
