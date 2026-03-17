import fs from 'fs/promises';
import path from 'path';

export class KnowledgeEngine {
  private static KNOWLEDGE_PATH = path.join(process.cwd(), 'storage', 'ai', 'knowledge');

  /**
   * Performs a simple keyword search across the knowledge base.
   * In a production environment, this would use vector embeddings and a vector database.
   */
  static async queryKnowledge(query: string): Promise<string[]> {
    const files = await fs.readdir(this.KNOWLEDGE_PATH);
    const relevantSnippets: string[] = [];

    // Simple keyword matching for this demonstration
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const content = await fs.readFile(path.join(this.KNOWLEDGE_PATH, file), 'utf-8');
      
      let score = 0;
      keywords.forEach(kw => {
        if (content.toLowerCase().includes(kw)) score++;
      });

      if (score > 0) {
        // Return file title and snippet
        relevantSnippets.push(`\n### Knowledge Source: ${file}\n${content.substring(0, 500)}...`);
      }
    }

    return relevantSnippets;
  }
}
