'use client';

import { X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ExecutionPanelProps {
  logs: any;
  onClose: () => void;
}

export default function ExecutionPanel({ logs, onClose }: ExecutionPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'skipped':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'skipped':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 h-96 bg-white border-t shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(logs.status)}
          <h3 className="font-semibold text-lg">Execution Log</h3>
          <span className="text-sm text-gray-500">
            {logs.executionId}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {logs.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-800">Workflow Error</p>
            <p className="text-sm text-red-600">{logs.error}</p>
          </div>
        )}

        {/* Node Logs */}
        <div className="space-y-3">
          {logs.nodeLogs?.map((nodeLog: any, index: number) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getStatusColor(nodeLog.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(nodeLog.status)}
                  <span className="font-semibold">{nodeLog.nodeId}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {nodeLog.retries ? `Retries: ${nodeLog.retries}` : ''}
                </span>
              </div>

              {nodeLog.error && (
                <div className="mt-2 p-2 bg-white rounded text-sm text-red-600">
                  <p className="font-semibold">Error:</p>
                  <p>{nodeLog.error}</p>
                </div>
              )}

              {nodeLog.inputs && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    Inputs
                  </summary>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                    {JSON.stringify(nodeLog.inputs, null, 2)}
                  </pre>
                </details>
              )}

              {nodeLog.outputs && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    Outputs
                  </summary>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                    {JSON.stringify(nodeLog.outputs, null, 2)}
                  </pre>
                </details>
              )}

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Started: {new Date(nodeLog.startTime).toLocaleTimeString()}</span>
                {nodeLog.endTime && (
                  <span>
                    Duration: {
                      (new Date(nodeLog.endTime).getTime() - 
                       new Date(nodeLog.startTime).getTime()) / 1000
                    }s
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Status: <span className="font-semibold capitalize">{logs.status}</span>
        </div>
        <div className="text-sm text-gray-600">
          {logs.nodeLogs?.length || 0} nodes executed
        </div>
      </div>
    </div>
  );
}
