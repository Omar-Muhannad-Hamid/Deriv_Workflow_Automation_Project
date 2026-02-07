import { Node } from './node';
import { Edge } from './edge';
import { Variable } from './variable';

export interface WorkflowSettings {
  errorHandling?: 'stopOnError' | 'continueOnError' | 'retry';
  maxRetries?: number;
  timeout?: number;
}

export interface WorkflowMetadata {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  tags?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  settings?: WorkflowSettings;
  nodes: Node[];
  edges: Edge[];
  variables?: Variable[];
  metadata?: WorkflowMetadata;
}

export interface WorkflowExecutionLog {
  workflowId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  error?: string;
  nodeLogs: NodeExecutionLog[];
}

export interface NodeExecutionLog {
  nodeId: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  inputs?: any;
  outputs?: any;
  error?: string;
  retries?: number;
}

export interface WorkflowValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export interface WorkflowCompileResult {
  success: boolean;
  n8nWorkflow?: any;
  runtimeCode?: string;
  errors?: string[];
}
