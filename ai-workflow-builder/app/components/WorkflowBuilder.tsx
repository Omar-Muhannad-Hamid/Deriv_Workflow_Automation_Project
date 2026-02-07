'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node as FlowNode,
  Edge as FlowEdge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Download, Plus, Trash2, Save } from 'lucide-react';
import { Workflow } from '@/types/workflow';
import { Node } from '@/types/node';
import NodeEditor from './NodeEditor';
import ExecutionPanel from './ExecutionPanel';

interface WorkflowBuilderProps {
  workflowId: string | null;
}

const nodeTypes = {
  trigger: { color: '#10b981' },
  action: { color: '#3b82f6' },
  condition: { color: '#f59e0b' },
  loop: { color: '#8b5cf6' },
  transform: { color: '#ec4899' },
  api: { color: '#06b6d4' },
  database: { color: '#6366f1' },
  notification: { color: '#f97316' },
  integration: { color: '#14b8a6' },
};

export default function WorkflowBuilder({ workflowId }: WorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<any>(null);

  // Load workflow when ID changes
  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/generate?userId=demo`);
      const data = await response.json();
      
      if (data.success) {
        const wf = data.workflows.find((w: any) => w.id === id);
        if (wf) {
          setWorkflow(wf.workflow);
          convertWorkflowToFlow(wf.workflow);
        }
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  };

  const convertWorkflowToFlow = (wf: Workflow) => {
    const flowNodes: FlowNode[] = wf.nodes.map((node) => ({
      id: node.id,
      type: 'default',
      position: node.position || { x: 0, y: 0 },
      data: {
        label: (
          <div className="px-4 py-2">
            <div className="font-semibold">{node.name || node.operation}</div>
            <div className="text-xs text-gray-500">{node.provider}</div>
          </div>
        ),
        node
      },
      style: {
        background: nodeTypes[node.type]?.color || '#gray',
        color: 'white',
        border: '2px solid white',
        borderRadius: '8px',
        minWidth: '150px',
      },
    }));

    const flowEdges: FlowEdge[] = wf.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type === 'conditional' ? 'step' : 'smoothstep',
      animated: edge.type === 'conditional',
      label: edge.label,
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!workflow) return;
      
      setEdges((eds) => addEdge(connection, eds));
      
      // Update workflow
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        type: 'default' as const,
      };
      
      updateWorkflow({
        ...workflow,
        edges: [...workflow.edges, newEdge]
      });
    },
    [workflow, setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNode(node.data.node);
  }, []);

  const updateWorkflow = async (updatedWorkflow: Workflow) => {
    if (!workflowId) return;
    
    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          action: 'updateWorkflow',
          data: { workflow: updatedWorkflow }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setWorkflow(data.workflow);
      }
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  };

  const handleExecute = async () => {
    if (!workflowId) return;
    
    setIsExecuting(true);
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, inputs: {} })
      });
      
      const data = await response.json();
      setExecutionLogs(data);
    } catch (error) {
      console.error('Error executing workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCompile = async (format: 'n8n' | 'runtime') => {
    if (!workflowId) return;
    
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, format })
      });
      
      const data = await response.json();
      if (data.success) {
        // Download compiled workflow
        const blob = new Blob([JSON.stringify(data.compiled, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow-${format}-${Date.now()}.json`;
        a.click();
      }
    } catch (error) {
      console.error('Error compiling workflow:', error);
    }
  };

  if (!workflow) {
    return (
      <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No workflow loaded</p>
          <p className="text-sm">Create a workflow using the AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{workflow.name}</h2>
          <p className="text-sm text-gray-500">{workflow.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
          </button>
          <button
            onClick={() => handleCompile('n8n')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export n8n</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Flow Editor */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        {selectedNode && (
          <div className="w-80 border-l">
            <NodeEditor
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={(updatedNode) => {
                // Update node in workflow
                const updatedWorkflow = {
                  ...workflow,
                  nodes: workflow.nodes.map(n =>
                    n.id === updatedNode.id ? updatedNode : n
                  )
                };
                updateWorkflow(updatedWorkflow);
                setSelectedNode(updatedNode);
              }}
            />
          </div>
        )}
      </div>

      {/* Execution Logs */}
      {executionLogs && (
        <ExecutionPanel
          logs={executionLogs}
          onClose={() => setExecutionLogs(null)}
        />
      )}
    </div>
  );
}
