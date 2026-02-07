# Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your API keys
# - Get Supabase keys from: https://supabase.com
# - Get Gemini API key from: https://ai.google.dev

# 4. Run database migration in Supabase SQL Editor
# Copy contents of: schema/database.sql

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

## 📋 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm test             # Run tests

# Quick setup (automated)
chmod +x setup.sh
./setup.sh
```

## 🎯 Quick Examples

### Create a Simple Workflow
```
Prompt: "Send an email when someone fills out a contact form"

Result: Workflow with webhook trigger → email action
```

### Edit a Node
1. Click on any node in the visual editor
2. Edit panel opens on the right
3. Modify inputs, settings, or runtime config
4. Click "Save Changes"

### Run a Workflow
1. Click "Run" button in toolbar
2. View execution logs in bottom panel
3. Check node-by-node status and outputs

### Export to n8n
1. Click "Export n8n" button
2. Download JSON file
3. Import into n8n platform

## 🔑 Environment Variables Quick Reference

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSy...

# Optional
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📊 Node Types Reference

| Type | Purpose | Examples |
|------|---------|----------|
| `trigger` | Start workflow | Webhook, Schedule, Email |
| `action` | Perform operation | Send email, API call, Database write |
| `condition` | Branch logic | If/else, Switch |
| `loop` | Iterate data | For each, While |
| `transform` | Modify data | Map, Filter, Format |
| `api` | HTTP requests | GET, POST, REST calls |
| `database` | DB operations | Query, Insert, Update |
| `notification` | Alerts | Slack, Email, SMS |
| `integration` | Third-party | Salesforce, Stripe, etc. |

## 🛠️ API Quick Reference

### Generate Workflow
```javascript
fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Your workflow description here'
  })
})
```

### Edit Workflow
```javascript
fetch('/api/edit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'workflow-id',
    action: 'addNode',
    data: { node: {...} }
  })
})
```

### Execute Workflow
```javascript
fetch('/api/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'workflow-id',
    inputs: { key: 'value' }
  })
})
```

## 🐛 Common Issues & Fixes

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Database Connection Issues
- Verify SUPABASE_URL and keys in .env
- Check Supabase project is active
- Ensure database migration was run

### AI Generation Fails
- Verify GEMINI_API_KEY is correct
- Check API quota/limits
- Try simpler prompts first

### Workflow Won't Execute
- Check all required node inputs are filled
- Verify no circular dependencies
- Review execution logs for errors

## 📁 Project Structure Quick Map

```
ai-workflow-builder/
├── app/
│   ├── api/              # API endpoints
│   ├── components/       # React components
│   └── page.tsx          # Main page
├── lib/
│   ├── ai.ts            # AI integration
│   ├── db.ts            # Database
│   ├── validator.ts     # Validation
│   ├── compiler.ts      # Compilation
│   └── runEngine.ts     # Execution
├── types/               # TypeScript types
├── schema/              # JSON schemas + SQL
└── docs/                # Documentation
```

## 🎨 Customization Quick Tips

### Add Custom Node Type
1. Edit `types/node.ts`
2. Add to NodeType union
3. Create executor in `lib/runEngine.ts`

### Change UI Theme
1. Edit `tailwind.config.js`
2. Modify color variables
3. Update `app/globals.css`

### Add New API Endpoint
1. Create file in `app/api/your-endpoint/route.ts`
2. Export POST/GET functions
3. Use lib functions for logic

## 📚 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **ReactFlow**: https://reactflow.dev/docs
- **Supabase**: https://supabase.com/docs
- **Google Gemini**: https://ai.google.dev/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🚢 Deployment Quick Start

### Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Docker
```bash
# Build
docker build -t ai-workflow-builder .

# Run
docker run -p 3000:3000 --env-file .env ai-workflow-builder
```

## 💡 Pro Tips

1. **Start Simple**: Test with basic workflows first
2. **Use Templates**: Check `docs/prompt-examples.md` for ideas
3. **Check Logs**: Execution panel shows detailed node logs
4. **Validate Often**: Save and test workflows incrementally
5. **Monitor Costs**: Keep track of AI API usage

## 🔗 Important Links

- Supabase Dashboard: https://supabase.com/dashboard
- Google AI Studio: https://ai.google.dev
- n8n Documentation: https://docs.n8n.io
- Project GitHub: [Your repo URL]

## 📞 Getting Help

1. Check README.md for detailed docs
2. Review docs/ARCHITECTURE.md for technical details
3. Look at tests/ for code examples
4. Open GitHub issue for bugs
5. Check existing issues for solutions

---

**Quick Question?** Most answers are in README.md!
