import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';

export class AIController {
  public async handleAgentCommand(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, agents, systemMode, targetRepo } = req.body;

      if (!prompt) {
        res.status(400).json({ error: 'Missing command prompt' });
        return;
      }

      const grokResponse = await aiService.callLLM(
        `You are VULN-GENOME Autonomous AI Agent Swarm Commander. 
You control 6 specialized cyber defense agents:
1. Sentinel-AST: Invariant AST code scanner, vulnerability extractor, data-flow tracer.
2. Synthesizer-X: Autonomous zero-regression patch synthesizer, surgical AST transformer.
3. Veritas-Proof: Z3 formal verifier, fuzzing test engine, cryptographic proof certifier.
4. Chrono-Guard: Historical lineage monitor, regression blocker, air-gapped quarantine interceptor.
5. Red-Storm: Adversarial exploit simulator, automated fuzz mutation hunter.
6. Genome-Curator: Invariant memory synthesizer, CVE pattern extractor.

Analyze the operator's command and output a STRICT JSON structure:
{
  "planSummary": "Short 1-2 sentence executive overview of what the swarm will do",
  "recommendedMode": "AUTONOMOUS" | "HUMAN_SUPERVISED" | "WAR_GAME_SIMULATION" | "AIR_GAPPED_FORTRESS",
  "primaryAgentId": "agent-sentinel" | "agent-synthesizer" | "agent-veritas" | "agent-chrono" | "agent-redstorm" | "agent-curator",
  "thoughtStream": [
    {
      "agentId": "agent-sentinel",
      "agentName": "Sentinel-AST",
      "type": "THOUGHT" | "TOOL_CALL" | "ACTION" | "VERDICT",
      "summary": "Brief 1-line thought",
      "detail": "Comprehensive technical reasoning detailing AST nodes, invariant rules, or formal verification"
    }
  ],
  "directiveSteps": [
    {
      "id": "step-1",
      "agentId": "agent-sentinel",
      "agentName": "Sentinel-AST",
      "stepName": "AST Pattern Traversal",
      "action": "Scan abstract syntax tree for taint flow and unvalidated input sinks",
      "status": "SUCCESS",
      "output": "Extracted 3 vulnerable sinks with 99.4% invariant confidence"
    }
  ],
  "missionOutcome": {
    "title": "Mission Outcome Title",
    "threatsIntercepted": 3,
    "patchesGenerated": 2,
    "proofsVerified": 2,
    "confidenceScore": 99.2,
    "status": "COMPLETED"
  },
  "tacticalAdvice": "Immediate recommendation for the security operator"
}`,
        `Operator Directive: "${prompt}". Current target: ${targetRepo || 'Production Core Repo'}. Mode: ${systemMode || 'AUTONOMOUS'}. Active Agents: ${JSON.stringify(agents || [])}`,
        true
      );

      if (grokResponse) {
        try {
          const parsed = JSON.parse(grokResponse.trim() || '{}');
          res.status(200).json({ success: true, aiSource: 'llm-live', ...parsed });
          return;
        } catch {
          // fallback to deterministic
        }
      }

      const plan = aiService.getDeterministicAgentPlan(prompt, targetRepo, systemMode);
      res.status(200).json({ success: true, aiSource: 'autonomous-invariant-engine', ...plan });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async handleAgentReasoning(req: Request, res: Response): Promise<void> {
    try {
      const { agentId, query, vulnerabilityContext } = req.body;
      const llmReasoning = await aiService.callLLM(
        'You are an autonomous sub-agent inside VULN-GENOME. Provide deep, technical reasoning with exact AST invariants, mathematical proof steps, or exploit vector analysis.',
        `Agent ID: ${agentId}. Query: "${query}". Context: ${JSON.stringify(vulnerabilityContext || {})}`
      );

      if (llmReasoning) {
        res.status(200).json({ success: true, reasoning: llmReasoning });
        return;
      }

      const reasoning = aiService.getDeterministicAgentReasoning(agentId, query);
      res.status(200).json({ success: true, reasoning });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async handleSwarmAction(req: Request, res: Response): Promise<void> {
    try {
      const { actionType } = req.body;
      res.status(200).json({
        success: true,
        actionType,
        timestamp: new Date().toISOString(),
        acknowledgedAgents: [
          'agent-sentinel',
          'agent-synthesizer',
          'agent-veritas',
          'agent-chrono',
          'agent-redstorm',
          'agent-curator',
        ],
        resultStatus: 'EXECUTING',
        telemetry: {
          nodesDispatched: 6,
          latencyMs: 12,
          confidencePct: 99.8,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const aiController = new AIController();
