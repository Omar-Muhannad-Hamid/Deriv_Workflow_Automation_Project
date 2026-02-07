import { NextRequest, NextResponse } from 'next/server';
import { compileToN8n, compileToRuntime, validateDependencies } from '@/lib/compiler';
import { workflowDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, format = 'n8n' } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Fetch workflow
    const workflowRecord = await workflowDb.getById(workflowId);
    const workflow = workflowRecord.workflow_json;

    // Validate dependencies
    const depValidation = validateDependencies(workflow);
    if (!depValidation.valid) {
      return NextResponse.json(
        {
          error: 'Workflow has dependency errors',
          details: depValidation.errors
        },
        { status: 400 }
      );
    }

    let result;

    // Compile based on format
    if (format === 'n8n') {
      result = compileToN8n(workflow);
    } else if (format === 'runtime') {
      result = compileToRuntime(workflow);
    } else {
      return NextResponse.json(
        { error: `Unknown format: ${format}` },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Compilation failed',
          details: result.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      format,
      compiled: format === 'n8n' ? result.n8nWorkflow : result.runtimeCode
    });
  } catch (error) {
    console.error('Error compiling workflow:', error);
    return NextResponse.json(
      {
        error: 'Failed to compile workflow',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
