# System Architecture

## Overview

The AI Workflow Builder follows a modern, cloud-native architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat UI      │  │ Visual       │  │ Node         │      │
│  │ (Gemini AI)  │  │ Editor       │  │ Editor       │      │
│  │              │  │ (ReactFlow)  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ /generate  │ │ /edit      │ │ /compile   │ │ /run     │ │
│  │ Workflow   │ │ Workflow   │ │ Workflow   │ │ Execute  │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Core Libraries                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ AI Module  │ │ Validator  │ │ Compiler   │ │ Runtime  │ │
│  │ (Gemini)   │ │ (AJV)      │ │ (n8n/code) │ │ Engine   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Supabase)                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ Workflows  │ │ Execution  │ │ Variables  │              │
│  │ Table      │ │ Logs       │ │ Table      │              │
│  └────────────┘ └────────────┘ └────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Layer

#### Chat Interface
- **Technology**: React with TypeScript
- **Purpose**: Natural language input for workflow creation
- **Features**: 
  - Real-time message streaming
  - Loading states
  - Error handling
  - Message history

#### Visual Editor
- **Technology**: ReactFlow
- **Purpose**: Visual workflow editing and manipulation
- **Features**:
  - Drag-and-drop nodes
  - Connection drawing
  - Minimap navigation
  - Background grid
  - Node selection and editing

#### Node Editor
- **Technology**: React form components
- **Purpose**: Detailed node configuration
- **Features**:
  - Input/output editing
  - Runtime settings
  - Validation feedback
  - Real-time updates

### API Layer

#### /api/generate
**Purpose**: Convert natural language to workflow JSON

**Flow**:
1. Receive prompt from user
2. Call Google Gemini AI with structured prompt
3. Parse AI response to JSON
4. Validate against schema
5. Save to database
6. Return workflow to client

**Input**:
```json
{
  "prompt": "string",
  "context": "string (optional)",
  "userId": "string (optional)"
}
```

**Output**:
```json
{
  "success": true,
  "workflow": { /* Workflow object */ },
  "workflowId": "uuid",
  "reasoning": "string"
}
```

#### /api/edit
**Purpose**: Modify existing workflows

**Supported Actions**:
- `editNode`: Update node configuration
- `addNode`: Insert new node
- `removeNode`: Delete node and edges
- `reorderNodes`: Change node sequence
- `addEdge`: Create connection
- `removeEdge`: Delete connection
- `updateNodePosition`: Move node in editor

**Flow**:
1. Fetch current workflow from DB
2. Apply requested modification
3. Validate updated workflow
4. Save changes
5. Return updated workflow

#### /api/compile
**Purpose**: Convert workflow to executable format

**Supported Formats**:
- **n8n**: n8n-compatible JSON
- **runtime**: Standalone JavaScript code

**Flow**:
1. Fetch workflow from DB
2. Validate dependencies
3. Apply format-specific compilation
4. Return compiled output

#### /api/run
**Purpose**: Execute workflow and return logs

**Flow**:
1. Fetch workflow from DB
2. Initialize execution context
3. Topologically sort nodes
4. Execute nodes sequentially
5. Log each node execution
6. Handle errors and retries
7. Save execution log to DB
8. Return results to client

### Core Libraries

#### AI Module (lib/ai.ts)
**Purpose**: Interface with Google Gemini AI

**Functions**:
- `generateWorkflowFromPrompt()`: Create workflow from text
- `editNodeWithAI()`: Modify node with AI assistance
- `getWorkflowSuggestions()`: AI-powered improvements

**AI Prompt Engineering**:
- Structured prompts for consistent output
- JSON-only responses
- Schema enforcement
- Context inclusion

#### Validator (lib/validator.ts)
**Purpose**: Ensure workflow integrity

**Functions**:
- `validateWorkflow()`: Check complete workflow
- `validateNode()`: Verify single node
- `validateEdge()`: Confirm connection validity
- `detectCycles()`: Find circular dependencies

**Validation Layers**:
1. JSON Schema validation (structure)
2. Logical validation (references, dependencies)
3. Cycle detection (prevent infinite loops)
4. Orphan node detection (ensure connectivity)

#### Compiler (lib/compiler.ts)
**Purpose**: Transform workflows to target formats

**Functions**:
- `compileToN8n()`: Generate n8n workflow JSON
- `compileToRuntime()`: Create executable code
- `validateDependencies()`: Check node references
- `topologicalSort()`: Order nodes for execution

**Compilation Steps**:
1. Validate workflow structure
2. Map node types to target format
3. Build connections/edges
4. Generate metadata
5. Package for export

#### Runtime Engine (lib/runEngine.ts)
**Purpose**: Execute workflows

**Features**:
- Sequential node execution
- Conditional branching
- Loop handling
- Error handling and retries
- Timeout management
- Data flow between nodes

**Execution Context**:
```typescript
{
  variables: Record<string, any>,  // Shared state
  secrets: Record<string, any>,    // Credentials
  metadata: {
    executionId: string,
    workflowId: string,
    startTime: string
  }
}
```

**Node Executors**:
- HTTP requests
- Data transformations
- Conditional logic
- Loops and iterations
- Custom operations (extensible)

### Data Layer

#### Database Schema

**workflows table**:
```sql
id: UUID (primary key)
name: VARCHAR(255)
description: TEXT
version: VARCHAR(50)
workflow_json: JSONB
user_id: VARCHAR(255)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**execution_logs table**:
```sql
id: UUID (primary key)
workflow_id: UUID (foreign key)
start_time: TIMESTAMP
end_time: TIMESTAMP
status: VARCHAR(50)
error: TEXT
logs_json: JSONB
created_at: TIMESTAMP
```

**variables table**:
```sql
id: UUID (primary key)
workflow_id: UUID (foreign key)
name: VARCHAR(255)
type: VARCHAR(50)
value: JSONB
scope: VARCHAR(50)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## Data Flow

### Workflow Creation Flow
```
User Input → Chat Interface
           → POST /api/generate
           → AI Module (Gemini)
           → Validator
           → Database (workflows)
           → Visual Editor
```

### Workflow Execution Flow
```
User Click "Run" → POST /api/run
                 → Load from Database
                 → Runtime Engine
                   ├─ Node 1 (execute)
                   ├─ Node 2 (execute)
                   └─ Node N (execute)
                 → Save Logs to Database
                 → Return to Execution Panel
```

### Workflow Editing Flow
```
User Edit Node → Node Editor
               → POST /api/edit
               → Fetch Workflow
               → Apply Changes
               → Validator
               → Save to Database
               → Update Visual Editor
```

## Security Architecture

### Authentication (Future Enhancement)
- Currently open for demo
- Production should use Supabase Auth
- JWT token validation
- Row-level security (RLS)

### Data Protection
- Environment variable management
- Secrets stored separately
- HTTPS in production
- CORS configuration

### Input Validation
- JSON Schema validation
- SQL injection prevention (Supabase)
- XSS prevention (React)
- Rate limiting (recommended)

## Scalability Considerations

### Horizontal Scaling
- Next.js API routes are stateless
- Can run multiple instances
- Load balancer distribution
- Serverless deployment ready

### Database Scaling
- Supabase auto-scaling
- Connection pooling
- Read replicas for high load
- Indexes on frequently queried columns

### Caching Strategy
- AI responses (optional)
- Workflow definitions
- Execution results (short-term)
- Static assets via CDN

## Performance Optimizations

### Frontend
- Code splitting (Next.js automatic)
- React component memoization
- Lazy loading of workflow editor
- Optimized ReactFlow rendering

### Backend
- Async/await for all I/O
- Database query optimization
- Connection pooling
- Timeout management

### AI Integration
- Structured prompts for faster parsing
- Response streaming (future)
- Request deduplication
- Error handling and retries

## Monitoring & Observability

### Recommended Monitoring
- Application logs (console, file)
- Database query performance
- API endpoint metrics
- AI API usage and costs
- Error tracking (Sentry)

### Key Metrics
- Workflow creation time
- Execution success rate
- Node execution duration
- Database query time
- AI response time

## Future Architecture Enhancements

### Planned Features
1. **Real-time Collaboration**: WebSocket integration
2. **Workflow Templates**: Pre-built workflow library
3. **Version Control**: Git-like workflow versioning
4. **Plugin System**: Custom node type support
5. **Advanced Scheduling**: Cron-based triggers
6. **Workflow Marketplace**: Share and discover workflows

### Technical Debt
- Add comprehensive error boundaries
- Implement request rate limiting
- Add response caching layer
- Enhance TypeScript strict mode
- Add E2E testing suite
- Implement workflow simulation mode

---

This architecture provides a solid foundation for a production-ready workflow builder while maintaining flexibility for future enhancements.
