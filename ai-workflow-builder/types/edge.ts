export type EdgeType = 'default' | 'conditional' | 'error' | 'success';

export interface EdgeCondition {
  enabled?: boolean;
  expression?: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: EdgeType;
  condition?: EdgeCondition;
  label?: string;
}

export interface EdgeValidationResult {
  valid: boolean;
  error?: string;
}
