'use client';

import { useState } from 'react';
import WorkflowBuilder from './components/WorkflowBuilder';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Workflow Builder
          </h1>
          <p className="text-lg text-gray-600">
            Build powerful automation workflows with AI assistance
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface onWorkflowCreated={setWorkflowId} />
          </div>

          {/* Workflow Builder */}
          <div className="lg:col-span-2">
            <WorkflowBuilder workflowId={workflowId} />
          </div>
        </div>
      </div>
    </main>
  );
}
