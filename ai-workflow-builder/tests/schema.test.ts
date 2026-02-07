import { validateWorkflow, validateNode, validateEdge } from '../lib/validator';
import { Workflow } from '../types/workflow';
import { Node } from '../types/node';
import { Edge } from '../types/edge';

describe('Workflow Validation', () => {
  const validWorkflow: Workflow = {
    id: 'test-workflow-1',
    name: 'Test Workflow',
    version: '1.0.0',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        provider: 'webhook',
        operation: 'receive',
        inputs: { url: '/webhook' },
      },
      {
        id: 'node-2',
        type: 'action',
        provider: 'email',
        operation: 'send',
        inputs: { to: 'test@example.com', subject: 'Test' },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
      },
    ],
  };

  test('should validate a correct workflow', () => {
    const result = validateWorkflow(validWorkflow);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  test('should reject workflow without required fields', () => {
    const invalidWorkflow = {
      name: 'Invalid Workflow',
      nodes: [],
    } as any;

    const result = validateWorkflow(invalidWorkflow);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  test('should detect circular dependencies', () => {
    const circularWorkflow: Workflow = {
      ...validWorkflow,
      edges: [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-2', target: 'node-1' },
      ],
    };

    const result = validateWorkflow(circularWorkflow);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.message.includes('Circular'))).toBe(true);
  });

  test('should detect invalid edge references', () => {
    const invalidEdgesWorkflow: Workflow = {
      ...validWorkflow,
      edges: [
        { id: 'edge-1', source: 'node-1', target: 'non-existent-node' },
      ],
    };

    const result = validateWorkflow(invalidEdgesWorkflow);
    expect(result.valid).toBe(false);
  });

  test('should require at least one trigger node', () => {
    const noTriggerWorkflow: Workflow = {
      ...validWorkflow,
      nodes: validWorkflow.nodes.map(n => ({ ...n, type: 'action' as const })),
    };

    const result = validateWorkflow(noTriggerWorkflow);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.message.includes('trigger'))).toBe(true);
  });
});

describe('Node Validation', () => {
  test('should validate a correct node', () => {
    const validNode: Node = {
      id: 'node-1',
      type: 'action',
      provider: 'http',
      operation: 'request',
      inputs: { url: 'https://api.example.com' },
    };

    const result = validateNode(validNode);
    expect(result.valid).toBe(true);
  });

  test('should reject node with invalid type', () => {
    const invalidNode = {
      id: 'node-1',
      type: 'invalid-type',
      provider: 'http',
      operation: 'request',
    } as any;

    const result = validateNode(invalidNode);
    expect(result.valid).toBe(false);
  });
});

describe('Edge Validation', () => {
  test('should validate a correct edge', () => {
    const validEdge: Edge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'default',
    };

    const result = validateEdge(validEdge);
    expect(result.valid).toBe(true);
  });

  test('should reject edge without source or target', () => {
    const invalidEdge = {
      id: 'edge-1',
      source: 'node-1',
    } as any;

    const result = validateEdge(invalidEdge);
    expect(result.valid).toBe(false);
  });
});
