# AI Workflow Builder

A complete AI-powered workflow builder MVP that converts natural language automation requests into editable, modular workflows. Built with Next.js, TypeScript, Google Gemini AI, and Supabase.

## Features

✨ **AI-Powered Generation**: Describe your automation in natural language and let AI build the workflow  
🎨 **Visual Workflow Editor**: Drag-and-drop interface with ReactFlow  
⚙️ **Editable Workflows**: Add, remove, reorder nodes dynamically  
🔄 **Real-time Execution**: Run workflows and see live execution logs  
📦 **Export to n8n**: Compile workflows to n8n-compatible JSON  
💾 **Persistent Storage**: All workflows saved in Supabase PostgreSQL  
🔍 **JSON Schema Validation**: Ensure workflow integrity  
🎯 **Node-level Logging**: Track execution status, inputs, outputs  

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Workflow Visualization**: ReactFlow
- **AI**: Google Gemini Pro
- **Database**: Supabase (PostgreSQL)
- **Validation**: AJV (JSON Schema)
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account ([supabase.com](https://supabase.com))
- Google Gemini API key ([ai.google.dev](https://ai.google.dev))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-workflow-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

4. **Setup database**

Go to your Supabase project → SQL Editor → New Query

Copy and paste the contents of `schema/database.sql` and run it.

5. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Workflow

1. Use the AI Assistant chat interface
2. Describe your automation (e.g., "Create a workflow that sends a Slack notification when a new email arrives")
3. The AI will generate a complete workflow with nodes and connections
4. View and edit the workflow in the visual editor

### Editing Workflows

**Add Node**: Click the "+" button and describe what you want to add  
**Edit Node**: Click on any node to open the editor panel  
**Remove Node**: Select node and press Delete or use the trash icon  
**Connect Nodes**: Drag from one node's handle to another  
**Reorder**: Drag nodes to reposition them  

### Running Workflows

1. Click the "Run" button in the toolbar
2. Watch real-time execution in the logs panel
3. View inputs, outputs, and errors for each node
4. Check execution status and timing

### Exporting Workflows

- **n8n Format**: Click "Export n8n" to download n8n-compatible JSON
- **Runtime Code**: Use the API to compile to executable JavaScript

## Project Structure

```
ai-workflow-builder/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── generate/         # AI workflow generation
│   │   ├── edit/             # Workflow editing
│   │   ├── compile/          # Workflow compilation
│   │   └── run/              # Workflow execution
│   ├── components/           # React components
│   │   ├── ChatInterface.tsx
│   │   ├── WorkflowBuilder.tsx
│   │   ├── NodeEditor.tsx
│   │   └── ExecutionPanel.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/                      # Core libraries
│   ├── ai.ts                 # Google Gemini integration
│   ├── db.ts                 # Supabase database client
│   ├── validator.ts          # JSON Schema validation
│   ├── compiler.ts           # Workflow compilation
│   └── runEngine.ts          # Workflow runtime executor
├── types/                    # TypeScript type definitions
│   ├── workflow.ts
│   ├── node.ts
│   ├── edge.ts
│   └── variable.ts
├── schema/                   # JSON schemas & DB schema
│   ├── workflow.schema.json
│   ├── node.schema.json
│   ├── edge.schema.json
│   ├── variable.schema.json
│   └── database.sql
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## API Reference

### Generate Workflow
```
POST /api/generate
Body: { prompt: string, context?: string, userId?: string }
Response: { success: boolean, workflow: Workflow, workflowId: string }
```

### Edit Workflow
```
POST /api/edit
Body: { 
  workflowId: string, 
  action: 'editNode' | 'addNode' | 'removeNode' | 'reorderNodes',
  data: any 
}
Response: { success: boolean, workflow: Workflow }
```

### Compile Workflow
```
POST /api/compile
Body: { workflowId: string, format: 'n8n' | 'runtime' }
Response: { success: boolean, compiled: any }
```

### Execute Workflow
```
POST /api/run
Body: { workflowId: string, inputs?: any, secrets?: any }
Response: { 
  success: boolean, 
  executionId: string,
  status: string,
  nodeLogs: NodeExecutionLog[]
}
```

## Architecture

### Workflow Structure

A workflow consists of:
- **Nodes**: Individual operations (triggers, actions, conditions, etc.)
- **Edges**: Connections between nodes defining data flow
- **Variables**: Shared data across the workflow
- **Settings**: Global configuration (error handling, retries, timeouts)

### Execution Flow

1. **Validation**: Workflow is validated against JSON schema
2. **Topological Sort**: Nodes are ordered based on dependencies
3. **Sequential Execution**: Nodes execute in order
4. **Data Flow**: Outputs from one node become inputs to connected nodes
5. **Error Handling**: Configurable retry logic and error propagation
6. **Logging**: Each node execution is logged with status, inputs, outputs

### AI Integration

The AI layer uses Google Gemini Pro to:
- Convert natural language to workflow JSON
- Edit individual nodes based on instructions
- Suggest workflow improvements
- Auto-generate node configurations

## Development

### Running Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Start: `npm start`
3. Ensure database is accessible from production
4. Set all environment variables

## Customization

### Adding Custom Node Types

Edit `types/node.ts` and add your node type:
```typescript
export type NodeType = 
  | 'trigger'
  | 'action'
  | 'your-custom-type';
```

### Adding Custom Executors

In `lib/runEngine.ts`, add your executor:
```typescript
const customExecutors = {
  'your-provider': {
    async execute(node, inputs, context) {
      // Your execution logic
      return outputs;
    }
  }
};
```

### Extending AI Prompts

Modify `lib/ai.ts` to customize AI behavior and output format.

## Example Workflows

### Email to Slack Notification
```
"When I receive an email from a VIP contact, send a Slack notification to #alerts channel"
```

### Daily Report Generator
```
"Every day at 9 AM, fetch sales data from Postgres, generate a summary, and email it to the team"
```

### Customer Onboarding
```
"When a new user signs up, send welcome email, create Slack channel, add to CRM, and schedule follow-up"
```

## Troubleshooting

**AI not generating workflows?**
- Check GEMINI_API_KEY in .env
- Verify API key has sufficient quota

**Database errors?**
- Verify Supabase credentials
- Run database migration script
- Check RLS policies are enabled

**Workflow execution fails?**
- Check node configuration
- Review execution logs
- Verify input/output mappings

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your projects!

## Support

For issues and questions:
- Open a GitHub issue
- Check existing documentation
- Review example workflows

## Roadmap

- [ ] More node types (Webhook, Schedule, Database, etc.)
- [ ] Visual node library/marketplace
- [ ] Workflow templates
- [ ] Collaborative editing
- [ ] Version control for workflows
- [ ] Advanced debugging tools
- [ ] Performance monitoring
- [ ] Cloud deployment guides

---

**Built with ❤️ for hackathons and automation enthusiasts**
