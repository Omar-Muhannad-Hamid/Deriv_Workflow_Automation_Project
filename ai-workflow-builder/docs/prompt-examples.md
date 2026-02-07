# Example Workflow Prompts

This document contains example prompts you can use with the AI Workflow Builder to create various automation workflows.

## Business Automation

### Employee Onboarding
```
Create a workflow for employee onboarding that:
1. Sends a welcome email to the new employee
2. Creates a Slack account and adds them to #general
3. Provisions access to Google Workspace
4. Creates tickets in Jira for IT setup tasks
5. Schedules a 30-day check-in meeting
```

### Invoice Processing
```
Build a workflow that processes invoices:
1. Trigger when a PDF invoice is uploaded to Google Drive
2. Extract invoice data using OCR
3. Validate the data against purchase orders in the database
4. If valid, create a payment record in accounting system
5. If invalid, send notification to finance team for review
6. Update invoice status in spreadsheet
```

### Customer Feedback Loop
```
Create a workflow for customer feedback:
1. Trigger when a support ticket is closed
2. Send satisfaction survey email
3. Wait for response (with 3-day timeout)
4. If score < 3, create high-priority task for manager
5. If score >= 4, send thank you email
6. Log all responses to analytics database
```

## Marketing Automation

### Lead Nurturing
```
Build a lead nurturing workflow:
1. Trigger when new lead is added to CRM
2. Send welcome email immediately
3. Wait 2 days, send educational content
4. Check if lead opened emails
5. If yes, assign to sales rep
6. If no, add to re-engagement campaign
7. Update lead score based on engagement
```

### Social Media Publishing
```
Create a social media publishing workflow:
1. Trigger daily at 9 AM
2. Fetch approved posts from content calendar
3. Post to Twitter, LinkedIn, Facebook
4. Monitor engagement for 2 hours
5. If engagement > threshold, boost post
6. Log metrics to analytics dashboard
```

### Email Campaign Automation
```
Build an email campaign workflow:
1. Segment contacts based on behavior
2. Personalize email content for each segment
3. Schedule sends at optimal times per timezone
4. Track opens, clicks, conversions
5. Automatically follow up with non-openers after 3 days
6. Remove unsubscribes from list
7. Generate campaign performance report
```

## Data Processing

### Daily Report Generator
```
Create a daily report workflow:
1. Trigger every morning at 8 AM
2. Query sales database for previous day
3. Calculate key metrics (revenue, orders, AOV)
4. Compare to last week and last month
5. Generate charts and visualizations
6. Compile into PDF report
7. Email to stakeholder list
```

### Data Synchronization
```
Build a data sync workflow:
1. Trigger every 15 minutes
2. Fetch new records from source system (Salesforce)
3. Transform data to match target schema
4. Check for duplicates in target (PostgreSQL)
5. Insert new records, update existing
6. Log sync statistics
7. Alert on errors or anomalies
```

### ETL Pipeline
```
Create an ETL workflow:
1. Extract data from multiple sources (API, CSV, database)
2. Clean and validate data
3. Transform to unified schema
4. Enrich with third-party data
5. Load to data warehouse
6. Update materialized views
7. Trigger downstream analytics jobs
```

## IT Operations

### Server Monitoring
```
Build a server monitoring workflow:
1. Trigger every 5 minutes
2. Check server health metrics (CPU, memory, disk)
3. If any metric > 80%, send warning alert
4. If metric > 95%, page on-call engineer
5. Auto-scale infrastructure if needed
6. Log all metrics to time-series database
7. Generate weekly capacity planning report
```

### Backup Automation
```
Create a backup workflow:
1. Trigger daily at 2 AM
2. Create snapshots of all databases
3. Compress and encrypt backups
4. Upload to S3 with proper versioning
5. Verify backup integrity
6. Delete backups older than 30 days
7. Send completion notification
```

### Incident Response
```
Build an incident response workflow:
1. Trigger on critical alert from monitoring system
2. Create incident ticket with details
3. Page on-call engineer via PagerDuty
4. Post to #incidents Slack channel
5. Start video bridge for war room
6. Update status page
7. Log all actions to incident timeline
```

## E-commerce

### Order Fulfillment
```
Create an order fulfillment workflow:
1. Trigger when order is placed
2. Check inventory availability
3. If available: reserve items, generate packing slip
4. If not available: send backorder notification
5. Send order to warehouse management system
6. Generate shipping label
7. Send tracking email to customer
8. Update order status in database
```

### Abandoned Cart Recovery
```
Build an abandoned cart workflow:
1. Trigger when cart is inactive for 1 hour
2. Send first reminder email with cart contents
3. Wait 24 hours
4. If no purchase, send email with 10% discount
5. Wait 48 hours
6. If still no purchase, send final reminder
7. Track conversion rates per email
```

### Review Collection
```
Create a review collection workflow:
1. Trigger 5 days after order delivery
2. Send review request email
3. If customer clicks link, direct to review page
4. If 5-star review, ask to post on Google/Yelp
5. If 1-3 star review, alert customer service
6. Send thank you email for all reviews
7. Update product ratings in database
```

## Content Management

### Blog Publishing
```
Build a blog publishing workflow:
1. Trigger when draft is marked as "ready to publish"
2. Run SEO checks (meta description, keywords)
3. Optimize images (compress, resize)
4. Schedule publication at optimal time
5. Publish to website
6. Share on social media channels
7. Submit to search engines
8. Send to email subscribers
```

### Video Processing
```
Create a video processing workflow:
1. Trigger when video is uploaded
2. Transcode to multiple formats/resolutions
3. Generate thumbnails at key frames
4. Extract audio for podcast version
5. Generate automatic captions
6. Upload to CDN
7. Update video metadata in CMS
8. Notify content team of completion
```

## Integration Examples

### Multi-System Integration
```
Create a workflow that integrates:
1. Salesforce (CRM)
2. HubSpot (Marketing)
3. Stripe (Payments)
4. Zendesk (Support)
5. Slack (Communications)

When a new customer signs up:
- Create contact in Salesforce
- Add to HubSpot email list
- Set up Stripe customer profile
- Create Zendesk organization
- Post welcome message in Slack
```

### API Aggregation
```
Build a workflow that aggregates data from:
1. Google Analytics (web traffic)
2. Facebook Ads (ad performance)
3. Mailchimp (email metrics)
4. Shopify (sales data)

Daily at 9 AM:
- Fetch data from all sources
- Normalize and combine metrics
- Calculate ROI per channel
- Generate unified dashboard
- Alert on anomalies
```

## Tips for Writing Prompts

1. **Be Specific**: Include exact trigger conditions and actions
2. **Use Numbers**: Specify timeouts, retry counts, thresholds
3. **Define Logic**: Describe if/else conditions clearly
4. **Name Services**: Mention specific tools (Slack, Gmail, etc.)
5. **Include Error Handling**: Describe what happens on failure
6. **Specify Outputs**: What data should be captured/logged?

## Prompt Templates

### Basic Template
```
Create a workflow that [triggers on X], then [action 1], [action 2], and [action 3]. If [condition], do [alternative action].
```

### Advanced Template
```
Build a workflow for [business process]:
1. Trigger: [when/what/where]
2. Initial Actions: [list of steps]
3. Conditional Logic:
   - If [condition A]: [action set A]
   - If [condition B]: [action set B]
4. Error Handling: [what to do on failure]
5. Notifications: [who to notify and when]
6. Logging: [what to track]
```

## Testing Your Workflows

After creating a workflow:
1. Review the generated nodes and connections
2. Edit node inputs to match your actual credentials/data
3. Run in test mode with sample data
4. Check execution logs for errors
5. Iterate and refine as needed

## Need Help?

If the AI doesn't generate the workflow you want:
- Try rephrasing your prompt
- Break complex workflows into smaller parts
- Provide more specific details
- Use examples from this document as templates
