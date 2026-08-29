import { Genome, Severity } from '../types';
import { apiClient } from './apiClient';
import { INITIAL_GENOMES } from '../data/mockData';

export interface CreateGenomePayload {
  id: string;
  cwe: string;
  title: string;
  description: string;
  severity: Severity;
  languages: ('java' | 'python' | 'cpp' | 'javascript' | 'go' | 'rust')[];
  occurrences?: number;
  sourcePattern?: string;
  transformationPattern?: string;
  sinkPattern?: string;
  missingGuardPattern?: string;
  invariantRule?: string;
  detectionRule?: string;
  relatedCVEs?: string[];
  relatedCves?: string[];
}

class GenomeService {
  private genomes: Genome[] = [...INITIAL_GENOMES];

  async getGenomes(): Promise<Genome[]> {
    return apiClient.get<Genome[]>('/genomes', () => {
      const stored = localStorage.getItem('vuln_genome_db');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return this.genomes;
        }
      }
      return this.genomes;
    });
  }

  async getGenomeById(id?: string): Promise<Genome | null> {
    if (!id || typeof id !== 'string') return null;
    return apiClient.get<Genome>(`/genomes/${id}`, async () => {
      const all = await this.getGenomes();
      return all.find((g) => g.id && g.id.toLowerCase() === id.toLowerCase()) || null;
    });
  }

  async createGenome(payload: CreateGenomePayload): Promise<Genome> {
    return apiClient.post<Genome>('/genomes', payload, async () => {
      const newGenome: Genome = {
        id: payload.id,
        cwe: payload.cwe,
        title: payload.title,
        description: payload.description,
        severity: payload.severity,
        languages: payload.languages,
        occurrences: payload.occurrences || 1,
        sourcePattern: payload.sourcePattern || 'HTTP Request Parameter / Unmarshaled Stream',
        transformationPattern: payload.transformationPattern || 'Direct property extraction',
        sinkPattern: payload.sinkPattern || 'Execution sink without parameterization',
        missingGuardPattern: payload.missingGuardPattern || 'Parameterized guard validation',
        invariantRule: payload.invariantRule || `rule AST_${payload.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()} { condition: match_sink }`,
        detectionRule: payload.detectionRule || `rule AST_${payload.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()} { condition: match_sink }`,
        firstSeen: new Date().toISOString().substring(0, 10),
        lastUpdated: new Date().toISOString().substring(0, 10),
        author: 'Security Officer Ingestion',
        relatedCVEs: payload.relatedCVEs || payload.relatedCves || [],
        relatedCves: payload.relatedCves || payload.relatedCVEs || [],
      };

      const all = await this.getGenomes();
      const updated = [newGenome, ...all];
      localStorage.setItem('vuln_genome_db', JSON.stringify(updated));
      return newGenome;
    });
  }

  async deleteGenome(id: string): Promise<boolean> {
    return apiClient.delete<boolean>(`/genomes/${id}`, async () => {
      const all = await this.getGenomes();
      const updated = all.filter((g) => g.id !== id);
      localStorage.setItem('vuln_genome_db', JSON.stringify(updated));
      return true;
    });
  }
}

export const genomeService = new GenomeService();
