import { NextRequest, NextResponse } from 'next/server';
import { WorkflowEngine } from '@/lib/runEngine';
import { workflowDb, executionLogDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, inputs = {}, secrets = {} } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Fetch workflow
    const workflowRecord = await workflowDb.getById(workflowId);
    const workflow = workflowRecord.workflow_json;

    // Create execution log record
    const executionId = uuidv4();
    const executionLogRecord = await executionLogDb.create({
      id: executionId,
      workflow_id: workflowId,
      start_time: new Date().toISOString(),
      status: 'running',
      logs_json: {},
      created_at: new Date().toISOString()
    });

    try {
      // Execute workflow
      const engine = new WorkflowEngine();
      const executionLog = await engine.execute(workflow, inputs, secrets);

      // Update execution log
      await executionLogDb.update(executionId, {
        end_time: executionLog.endTime,
        status: executionLog.status,
        error: executionLog.error,
        logs_json: executionLog
      });

      return NextResponse.json({
        success: true,
        executionId,
        status: executionLog.status,
        nodeLogs: executionLog.nodeLogs,
        error: executionLog.error
      });
    } catch (error) {
      // Update execution log with error
      await executionLogDb.update(executionId, {
        end_time: new Date().toISOString(),
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute workflow',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');
    const executionId = searchParams.get('executionId');

    if (executionId) {
      // Get specific execution log
      const log = await executionLogDb.getByWorkflowId(workflowId || '');
      const execution = log.find(l => l.id === executionId);
      
      if (!execution) {
        return NextResponse.json(
          { error: 'Execution not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        execution: {
          id: execution.id,
          workflowId: execution.workflow_id,
          startTime: execution.start_time,
          endTime: execution.end_time,
          status: execution.status,
          error: execution.error,
          logs: execution.logs_json
        }
      });
    }

    if (workflowId) {
      // Get all executions for workflow
      const logs = await executionLogDb.getByWorkflowId(workflowId);
      
      return NextResponse.json({
        success: true,
        executions: logs.map(log => ({
          id: log.id,
          workflowId: log.workflow_id,
          startTime: log.start_time,
          endTime: log.end_time,
          status: log.status,
          error: log.error
        }))
      });
    }

    return NextResponse.json(
      { error: 'workflowId or executionId is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching execution logs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch execution logs',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
