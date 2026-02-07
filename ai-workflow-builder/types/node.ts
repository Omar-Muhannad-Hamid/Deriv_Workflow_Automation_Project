export type NodeType = 
  | 'trigger'
  | 'action'
  | 'condition'
  | 'loop'
  | 'transform'
  | 'api'
  | 'database'
  | 'notification'
  | 'integration';

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeRuntime {
  timeout?: number;
  retries?: number;
  continueOnError?: boolean;
}

export interface NodeCredentials {
  id?: string;
  name?: string;
}

export interface NodeCondition {
  enabled?: boolean;
  expression?: string;
}

export interface Node {
  id: string;
  type: NodeType;
  provider: string;
  operation: string;
  name?: string;
  description?: string;
  position?: NodePosition;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  runtime?: NodeRuntime;
  credentials?: NodeCredentials;
  condition?: NodeCondition;
}

export interface NodeDefinition {
  type: NodeType;
  provider: string;
  operations: Array<{
    name: string;
    description: string;
    inputSchema: any;
    outputSchema: any;
  }>;
  requiresAuth: boolean;
  icon?: string;
  color?: string;
}

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  node: Partial<Node>;
}
