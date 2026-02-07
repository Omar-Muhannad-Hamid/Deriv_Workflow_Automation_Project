'use client';

import { useState } from 'react';
import { Node } from '@/types/node';
import { X, Save, Edit } from 'lucide-react';

interface NodeEditorProps {
  node: Node;
  onClose: () => void;
  onUpdate: (node: Node) => void;
}

export default function NodeEditor({ node, onClose, onUpdate }: NodeEditorProps) {
  const [editedNode, setEditedNode] = useState<Node>(node);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(editedNode);
    setIsEditing(false);
  };

  const updateInput = (key: string, value: any) => {
    setEditedNode({
      ...editedNode,
      inputs: {
        ...editedNode.inputs,
        [key]: value
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{node.name || node.operation}</h3>
          <p className="text-sm text-gray-500">{node.provider}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <div className="px-3 py-2 bg-white border rounded-lg">
            <span className="capitalize">{node.type}</span>
          </div>
        </div>

        {/* Node Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={editedNode.name || ''}
            onChange={(e) => setEditedNode({ ...editedNode, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={editedNode.description || ''}
            onChange={(e) => setEditedNode({ ...editedNode, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inputs
          </label>
          <div className="space-y-3">
            {Object.entries(editedNode.inputs || {}).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs text-gray-600 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={typeof value === 'object' ? JSON.stringify(value) : value}
                  onChange={(e) => updateInput(key, e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Runtime Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Runtime Settings
          </label>
          <div className="space-y-3 bg-white p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Continue on Error</span>
              <input
                type="checkbox"
                checked={editedNode.runtime?.continueOnError || false}
                onChange={(e) => setEditedNode({
                  ...editedNode,
                  runtime: {
                    ...editedNode.runtime,
                    continueOnError: e.target.checked
                  }
                })}
                className="rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Max Retries
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={editedNode.runtime?.retries || 0}
                onChange={(e) => setEditedNode({
                  ...editedNode,
                  runtime: {
                    ...editedNode.runtime,
                    retries: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Timeout (ms)
              </label>
              <input
                type="number"
                min="0"
                value={editedNode.runtime?.timeout || 30000}
                onChange={(e) => setEditedNode({
                  ...editedNode,
                  runtime: {
                    ...editedNode.runtime,
                    timeout: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Outputs Preview */}
        {node.outputs && Object.keys(node.outputs).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Schema
            </label>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
              <pre>{JSON.stringify(node.outputs, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
