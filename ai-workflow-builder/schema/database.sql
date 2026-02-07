-- AI Workflow Builder Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workflows table
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL,
    workflow_json JSONB NOT NULL,
    user_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for workflows
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);

-- Execution logs table
CREATE TABLE execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL,
    error TEXT,
    logs_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for execution logs
CREATE INDEX idx_execution_logs_workflow_id ON execution_logs(workflow_id);
CREATE INDEX idx_execution_logs_created_at ON execution_logs(created_at DESC);
CREATE INDEX idx_execution_logs_status ON execution_logs(status);

-- Variables table
CREATE TABLE variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    value JSONB,
    scope VARCHAR(50) DEFAULT 'workflow',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, name)
);

-- Add indexes for variables
CREATE INDEX idx_variables_workflow_id ON variables(workflow_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variables_updated_at BEFORE UPDATE ON variables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE variables ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read workflows (for demo purposes)
-- In production, you'd want to restrict this to authenticated users
CREATE POLICY "Allow public read access on workflows" 
    ON workflows FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert on workflows" 
    ON workflows FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update on workflows" 
    ON workflows FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete on workflows" 
    ON workflows FOR DELETE 
    USING (true);

-- Similar policies for execution logs
CREATE POLICY "Allow public read access on execution_logs" 
    ON execution_logs FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert on execution_logs" 
    ON execution_logs FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update on execution_logs" 
    ON execution_logs FOR UPDATE 
    USING (true);

-- Similar policies for variables
CREATE POLICY "Allow public read access on variables" 
    ON variables FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert on variables" 
    ON variables FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update on variables" 
    ON variables FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete on variables" 
    ON variables FOR DELETE 
    USING (true);

-- Sample data (optional)
-- INSERT INTO workflows (name, description, version, workflow_json) VALUES
-- ('Sample Workflow', 'A sample automation workflow', '1.0.0', '{
--   "id": "sample-1",
--   "name": "Sample Workflow",
--   "version": "1.0.0",
--   "nodes": [],
--   "edges": []
-- }');
