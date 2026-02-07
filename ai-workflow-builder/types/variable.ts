export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';
export type VariableScope = 'global' | 'workflow' | 'node';

export interface Variable {
  id: string;
  name: string;
  type: VariableType;
  value?: any;
  description?: string;
  scope?: VariableScope;
  mutable?: boolean;
}

export interface VariableContext {
  global: Record<string, any>;
  workflow: Record<string, any>;
  node: Record<string, any>;
}
