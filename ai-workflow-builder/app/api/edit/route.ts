import { NextRequest, NextResponse } from 'next/server';
import { editNodeWithAI } from '@/lib/ai';
import { validateWorkflow, validateNode } from '@/lib/validator';
import { workflowDb } from '@/lib/db';
import { Workflow } from '@/types/workflow';
import { Node } from '@/types/node';
import { Edge } from '@/types/edge';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, action, data } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Fetch current workflow
    const workflowRecord = await workflowDb.getById(workflowId);
    const workflow: Workflow = workflowRecord.workflow_json;

    let updatedWorkflow: Workflow = { ...workflow };

    // Handle different edit actions
    switch (action) {
      case 'editNode':
        updatedWorkflow = await handleEditNode(workflow, data);
        break;
      
      case 'addNode':
        updatedWorkflow = await handleAddNode(workflow, data);
        break;
      
      case 'removeNode':
        updatedWorkflow = handleRemoveNode(workflow, data);
        break;
      
      case 'reorderNodes':
        updatedWorkflow = handleReorderNodes(workflow, data);
        break;
      
      case 'addEdge':
        updatedWorkflow = handleAddEdge(workflow, data);
        break;
      
      case 'removeEdge':
        updatedWorkflow = handleRemoveEdge(workflow, data);
        break;
      
      case 'updateNodePosition':
        updatedWorkflow = handleUpdateNodePosition(workflow, data);
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    // Validate updated workflow
    const validation = validateWorkflow(updatedWorkflow);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Updated workflow failed validation',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Save updated workflow
    const savedWorkflow = await workflowDb.update(workflowId, {
      workflow_json: updatedWorkflow,
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      workflow: savedWorkflow.workflow_json
    });
  } catch (error) {
    console.error('Error editing workflow:', error);
    return NextResponse.json(
      {
        error: 'Failed to edit workflow',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

async function handleEditNode(workflow: Workflow, data: any): Promise<Workflow> {
  const { nodeId, instruction } = data;

  if (instruction) {
    // Use AI to edit node
    const { node: editedNode } = await editNodeWithAI({
      workflow,
      nodeId,
      instruction
    });

    // Replace node in workflow
    const nodeIndex = workflow.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) {
      throw new Error(`Node ${nodeId} not found`);
    }

    workflow.nodes[nodeIndex] = editedNode;
  } else if (data.updates) {
    // Direct node updates
    const nodeIndex = workflow.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) {
      throw new Error(`Node ${nodeId} not found`);
    }

    workflow.nodes[nodeIndex] = {
      ...workflow.nodes[nodeIndex],
      ...data.updates
    };
  }

  return workflow;
}

async function handleAddNode(workflow: Workflow, data: any): Promise<Workflow> {
  const { node, afterNodeId, aiSuggestion } = data;

  let newNode: Node;

  if (aiSuggestion) {
    // Use AI to suggest and create node
    const { node: suggestedNode } = await editNodeWithAI({
      workflow,
      nodeId: 'new',
      instruction: aiSuggestion
    });
    newNode = suggestedNode;
  } else {
    newNode = node;
  }

  // Ensure node has ID
  if (!newNode.id) {
    newNode.id = uuidv4();
  }

  // Validate node
  const validation = validateNode(newNode);
  if (!validation.valid) {
    throw new Error(`Invalid node: ${validation.errors?.map(e => e.message).join(', ')}`);
  }

  // Add node to workflow
  if (afterNodeId) {
    const afterIndex = workflow.nodes.findIndex(n => n.id === afterNodeId);
    workflow.nodes.splice(afterIndex + 1, 0, newNode);
  } else {
    workflow.nodes.push(newNode);
  }

  // Auto-connect if afterNodeId specified
  if (afterNodeId) {
    const newEdge: Edge = {
      id: uuidv4(),
      source: afterNodeId,
      target: newNode.id,
      type: 'default'
    };
    workflow.edges.push(newEdge);
  }

  return workflow;
}

function handleRemoveNode(workflow: Workflow, data: any): Workflow {
  const { nodeId } = data;

  // Remove node
  workflow.nodes = workflow.nodes.filter(n => n.id !== nodeId);

  // Remove connected edges
  workflow.edges = workflow.edges.filter(
    e => e.source !== nodeId && e.target !== nodeId
  );

  return workflow;
}

function handleReorderNodes(workflow: Workflow, data: any): Workflow {
  const { nodeOrder } = data;

  if (!Array.isArray(nodeOrder)) {
    throw new Error('nodeOrder must be an array of node IDs');
  }

  // Reorder nodes based on provided order
  const orderedNodes = nodeOrder
    .map(id => workflow.nodes.find(n => n.id === id))
    .filter((n): n is Node => n !== undefined);

  // Add any nodes not in the order at the end
  const remainingNodes = workflow.nodes.filter(
    n => !nodeOrder.includes(n.id)
  );

  workflow.nodes = [...orderedNodes, ...remainingNodes];

  return workflow;
}

function handleAddEdge(workflow: Workflow, data: any): Workflow {
  const { edge } = data;

  // Ensure edge has ID
  if (!edge.id) {
    edge.id = uuidv4();
  }

  // Verify source and target nodes exist
  const sourceExists = workflow.nodes.some(n => n.id === edge.source);
  const targetExists = workflow.nodes.some(n => n.id === edge.target);

  if (!sourceExists || !targetExists) {
    throw new Error('Source or target node does not exist');
  }

  workflow.edges.push(edge);

  return workflow;
}

function handleRemoveEdge(workflow: Workflow, data: any): Workflow {
  const { edgeId } = data;

  workflow.edges = workflow.edges.filter(e => e.id !== edgeId);

  return workflow;
}

function handleUpdateNodePosition(workflow: Workflow, data: any): Workflow {
  const { nodeId, position } = data;

  const node = workflow.nodes.find(n => n.id === nodeId);
  if (!node) {
    throw new Error(`Node ${nodeId} not found`);
  }

  node.position = position;

  return workflow;
}
