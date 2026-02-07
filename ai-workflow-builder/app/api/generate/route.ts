import { NextRequest, NextResponse } from 'next/server';
import { generateWorkflowFromPrompt } from '@/lib/ai';
import { validateWorkflow } from '@/lib/validator';
import { workflowDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context, userId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate workflow using AI
    console.log('Generating workflow from prompt:', prompt);
    const { workflow, reasoning } = await generateWorkflowFromPrompt({
      prompt,
      context
    });

    // Ensure workflow has proper ID and version
    if (!workflow.id) {
      workflow.id = uuidv4();
    }
    if (!workflow.version) {
      workflow.version = '1.0.0';
    }

    // Validate generated workflow
    const validation = validateWorkflow(workflow);
    if (!validation.valid) {
      console.error('Generated workflow is invalid:', validation.errors);
      return NextResponse.json(
        {
          error: 'Generated workflow failed validation',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Save to database
    const savedWorkflow = await workflowDb.create({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      version: workflow.version,
      workflow_json: workflow,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      workflow: savedWorkflow.workflow_json,
      workflowId: savedWorkflow.id,
      reasoning
    });
  } catch (error) {
    console.error('Error generating workflow:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate workflow',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const workflows = await workflowDb.getAll(userId || undefined);

    return NextResponse.json({
      success: true,
      workflows: workflows.map(w => ({
        id: w.id,
        name: w.name,
        description: w.description,
        version: w.version,
        createdAt: w.created_at,
        updatedAt: w.updated_at,
        workflow: w.workflow_json
      }))
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch workflows',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
