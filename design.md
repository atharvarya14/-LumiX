# Design: LumiX – Intelligent Classroom Engagement Platform

## 1. Design Goals

The design of LumiX aims to:

- Enable real-time engagement monitoring during live classes
- Support role-based experiences for teachers, students, and parents
- Ensure privacy-first engagement analysis
- Scale to multiple classes and institutions
- Maintain low latency for real-time feedback
- Align with cloud-native and serverless best practices

## 2. Architectural Overview

LumiX follows a cloud-native, serverless, event-driven architecture consisting of:

- Web-based frontend clients
- Role-based authentication and authorization
- Stateless backend APIs
- Real-time engagement processing pipeline
- Persistent data storage for analytics and reporting
- Notification and messaging services

The architecture is designed to map directly to the functional and non-functional requirements defined in the requirements document.

## 3. High-Level System Architecture

### Core Components

1. **Frontend Web Application**
2. **Authentication & Authorization Layer**
3. **Backend API Layer**
4. **Real-Time Engagement Processing Layer**
5. **Data Storage & Analytics Layer**
6. **Notification & Messaging Layer**

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (S3 + CloudFront)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Teacher    │  │   Student    │  │    Parent    │     │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Authentication (Amazon Cognito)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                API Gateway (REST + WebSocket)                │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Business Logic Layer   │  │  Real-Time Processing    │
│     (AWS Lambda)         │  │     (AWS Lambda)         │
│                          │  │   + Rekognition          │
└──────────────────────────┘  └──────────────────────────┘
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Data Storage Layer     │  │  Notification Layer      │
│   (DynamoDB + S3)        │  │   (SNS + SES)            │
└──────────────────────────┘  └──────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│          Analytics & Reporting (QuickSight)                  │
└─────────────────────────────────────────────────────────────┘
```

## 4. Frontend Design

### 4.1 Client Applications

- **Technology**: Single-page web application (SPA)
- **Responsive Design**: Supporting desktop and mobile devices
- **Role-Based Dashboards**:
  - Teacher Dashboard
  - Student Dashboard
  - Parent Dashboard

### 4.2 UI Responsibilities

- Render real-time engagement indicators
- Display schedules, assignments, reports, and analytics
- Support live class interaction
- Provide messaging and notifications
- Allow configuration of preferences (alerts, notifications)

### 4.3 Hosting & Delivery

- **Static Hosting**: Amazon S3
- **Content Delivery**: Amazon CloudFront (global CDN)
- **Security**: HTTPS enforced for all traffic

### 4.4 Frontend Components by Role

#### Teacher Dashboard Components
- Overview metrics widget (total students, active lessons, performance)
- Live class control panel
- Real-time engagement monitor
- Student profile viewer
- Assignment management interface
- Attention reports section
- Alert notification center
- Schedule and timetable view
- Analytics dashboard

#### Student Dashboard Components
- Daily schedule widget
- Live class join interface
- Assignment tracker
- Personal engagement metrics display
- Focus score visualization
- Messaging interface
- Resource library access

#### Parent Dashboard Components
- Weekly engagement summary
- Attendance calendar
- Subject-wise performance reports
- Teacher message inbox
- Notification preferences panel
- Alert configuration interface

## 5. Authentication & Authorization Design

### 5.1 Authentication Service

- **Provider**: Amazon Cognito
- **User Pools**: Separate user groups for:
  - Teachers
  - Students
  - Parents

### 5.2 Authorization Model

- **Role-Based Access Control (RBAC)** enforced at:
  - Frontend routing level
  - Backend API authorization level
- **Token-Based Authentication**: JWT (JSON Web Tokens)
- **Session Management**: Secure session handling with token refresh

### 5.3 Authentication Flow

1. User submits credentials to Cognito
2. Cognito validates and returns JWT tokens (ID token, access token, refresh token)
3. Frontend stores tokens securely
4. All API requests include access token in Authorization header
5. API Gateway validates token before routing to Lambda
6. Lambda functions verify user role and permissions

## 6. Backend API Design

### 6.1 API Layer

**Amazon API Gateway** exposes:

#### REST APIs
Handle synchronous operations:
- User management (CRUD operations)
- Assignment management (create, update, delete, submit)
- Schedule management (view, update)
- Report generation and retrieval
- Notification preferences
- Messaging (send, retrieve)

#### WebSocket APIs
Handle real-time bidirectional communication:
- Real-time engagement updates
- Live alerts and notifications
- Focus nudges
- Live class status updates

### 6.2 Business Logic

**Implementation**: AWS Lambda functions

**Characteristics**:
- Stateless functions for scalability
- Event-driven execution
- Auto-scaling based on demand

**Key Responsibilities**:
- Engagement index calculation
- Alert generation and threshold evaluation
- Assignment workflows (creation, submission, grading)
- Report aggregation and generation
- Messaging orchestration
- Data validation and transformation

### 6.3 API Endpoints (Examples)

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

#### Teacher APIs
- `GET /teacher/dashboard` - Get dashboard metrics
- `POST /teacher/announcements` - Create announcement
- `POST /teacher/classes/start` - Start live class
- `POST /teacher/classes/end` - End live class
- `GET /teacher/students/{id}` - Get student profile
- `POST /teacher/assignments` - Create assignment
- `GET /teacher/reports/engagement` - Get engagement reports

#### Student APIs
- `GET /student/dashboard` - Get dashboard data
- `GET /student/schedule` - Get daily schedule
- `POST /student/classes/join` - Join live class
- `GET /student/assignments` - Get assignments
- `POST /student/assignments/{id}/submit` - Submit assignment
- `GET /student/metrics` - Get personal engagement metrics

#### Parent APIs
- `GET /parent/dashboard` - Get dashboard summary
- `GET /parent/child/engagement` - Get child's engagement summary
- `GET /parent/child/attendance` - Get attendance records
- `GET /parent/child/performance` - Get academic performance
- `PUT /parent/preferences` - Update notification preferences

#### WebSocket Connections
- `wss://api.lumix.com/engagement` - Real-time engagement stream
- `wss://api.lumix.com/alerts` - Real-time alert stream
- `wss://api.lumix.com/messages` - Real-time messaging

## 7. Real-Time Engagement Processing Design

### 7.1 Engagement Signals

Engagement index is computed as a composite score based on:

1. **Presence Detection**
   - Student is actively in the session
   - Camera/video feed is active (if applicable)
   - Periodic presence checks

2. **Interaction Frequency**
   - Mouse movements and clicks
   - Keyboard activity
   - Chat participation
   - Question responses
   - Poll participation

3. **Session Activity Duration**
   - Continuous active time
   - Tab focus duration
   - Idle time detection

### 7.2 Processing Flow

1. **Student joins live class**
   - WebSocket connection established
   - Engagement tracking initiated

2. **Engagement signals captured in real time**
   - Frontend sends periodic activity pings
   - Interaction events streamed to backend

3. **Signals processed transiently**
   - Lambda function receives engagement events
   - No raw data stored, only processed metrics

4. **Composite engagement index calculated**
   - Weighted algorithm combines signals
   - Score normalized to 0-100 scale

5. **Real-time updates streamed to teacher dashboard**
   - WebSocket pushes engagement updates
   - Visual indicators updated in UI

6. **Focus nudges generated for students**
   - Threshold evaluation (e.g., score < 50)
   - Gentle reminder sent via WebSocket

### 7.3 Engagement Index Calculation

```
Engagement Score = (w1 × Presence) + (w2 × Interaction) + (w3 × Activity)

Where:
- w1, w2, w3 are weights (sum to 1.0)
- Presence: Binary (1 if present, 0 if absent)
- Interaction: Normalized frequency (0-1)
- Activity: Normalized duration (0-1)

Example weights:
- w1 = 0.3 (Presence)
- w2 = 0.4 (Interaction)
- w3 = 0.3 (Activity)
```

### 7.4 AI & Analytics Services

**Amazon Rekognition** (optional enhancement):
- Presence detection
- Head pose / attention-related signals
- **Privacy constraints**:
  - No facial recognition or identity matching
  - No storage of raw images or video frames
  - Processing done in real-time only

## 8. Data Storage Design

### 8.1 Operational Data (Amazon DynamoDB)

**Tables**:

#### Users Table
- Partition Key: `userId`
- Attributes: `role`, `name`, `email`, `createdAt`, `preferences`

#### Classes Table
- Partition Key: `classId`
- Attributes: `teacherId`, `name`, `schedule`, `students[]`, `createdAt`

#### Sessions Table
- Partition Key: `sessionId`
- Sort Key: `timestamp`
- Attributes: `classId`, `teacherId`, `status`, `startTime`, `endTime`

#### Engagement Metrics Table
- Partition Key: `sessionId`
- Sort Key: `studentId`
- Attributes: `engagementScore`, `presenceTime`, `interactionCount`, `timestamp`

#### Attendance Table
- Partition Key: `studentId`
- Sort Key: `date`
- Attributes: `classId`, `status`, `duration`

#### Assignments Table
- Partition Key: `assignmentId`
- Attributes: `classId`, `teacherId`, `title`, `description`, `dueDate`, `createdAt`

#### Submissions Table
- Partition Key: `assignmentId`
- Sort Key: `studentId`
- Attributes: `submittedAt`, `content`, `grade`, `feedback`

#### Notifications Table
- Partition Key: `userId`
- Sort Key: `timestamp`
- Attributes: `type`, `message`, `read`, `priority`

#### Messages Table
- Partition Key: `conversationId`
- Sort Key: `timestamp`
- Attributes: `senderId`, `recipientId`, `content`, `read`

### 8.2 Analytical & Report Data (Amazon S3)

**Buckets**:
- `lumix-engagement-reports/` - Aggregated engagement reports
- `lumix-weekly-summaries/` - Weekly parent summaries
- `lumix-analytics-snapshots/` - Historical analytics data
- `lumix-exports/` - User-requested data exports

**Data Format**: JSON, CSV, or Parquet for efficient querying

## 9. Analytics & Reporting Design

### 9.1 Data Aggregation

- Engagement and performance data aggregated post-session
- Scheduled Lambda functions run aggregation jobs:
  - Hourly: Session-level aggregation
  - Daily: Student and class-level aggregation
  - Weekly: Parent summary generation

### 9.2 Reporting Service

**Amazon QuickSight** used for:
- Class-wide engagement trends
- Student performance analytics
- Parent-friendly visual summaries
- Teacher dashboard visualizations

### 9.3 Report Types

#### Daily Reports (Students, Teachers)
- Session engagement summary
- Attendance status
- Assignment completion status
- Alert summary

#### Weekly Reports (Parents)
- Weekly engagement average
- Attendance percentage
- Academic performance trends
- Teacher feedback summary

#### Custom Reports
- Date range selection
- Subject-wise filtering
- Student comparison
- Exportable formats (PDF, CSV)

## 10. Notification & Messaging Design

### 10.1 Notification Types

1. **Low Engagement Alerts**
   - Triggered when engagement score < threshold
   - Delivered to teachers in real-time

2. **Low Attention Alerts**
   - Triggered when student focus drops
   - Delivered to parents (if configured)

3. **Assignment Reminders**
   - Scheduled notifications before due dates
   - Delivered to students and parents

4. **Daily Summary Emails**
   - Scheduled end-of-day summaries
   - Delivered to parents (if configured)

5. **Teacher Messages**
   - Instant notifications for new messages
   - Delivered to students and parents

### 10.2 Delivery Mechanisms

- **Amazon SNS**: Event-based push notifications
- **Amazon SES**: Email delivery
- **WebSocket**: In-app real-time notifications
- **Notification Preferences**: Enforced per user settings

### 10.3 Notification Flow

1. Event occurs (e.g., low engagement detected)
2. Lambda function evaluates notification rules
3. User preferences checked
4. Notification formatted based on delivery method
5. SNS/SES/WebSocket delivers notification
6. Delivery status tracked

## 11. Security & Privacy Design

### 11.1 Data Security

- **Encryption in Transit**: All communication secured via HTTPS (TLS 1.3)
- **Encryption at Rest**: DynamoDB and S3 encryption enabled
- **IAM Roles**: Follow least-privilege principle
- **API Security**: JWT validation, rate limiting, input validation

### 11.2 Privacy Protections

- **No Biometric Storage**: No storage of biometric, image, or video data
- **Transient Processing**: Engagement signals processed in real-time, not stored
- **Anonymization**: Engagement data anonymized at aggregation level
- **Summary Only**: Parents receive summary analytics only, not live feeds
- **Compliance**: GDPR-like principles (data minimization, purpose limitation)

### 11.3 Access Control

- Role-based access enforced at all layers
- Students can only access their own data
- Parents can only access their child's data
- Teachers can only access their class data
- Admins have full access with audit logging

## 12. Scalability & Performance Design

### 12.1 Scalability Strategies

- **Serverless Architecture**: Auto-scaling Lambda functions
- **Stateless APIs**: Horizontal scaling without session affinity
- **DynamoDB Auto-Scaling**: Automatic capacity adjustment
- **CloudFront Caching**: Reduced origin load
- **WebSocket Connection Management**: Efficient connection pooling

### 12.2 Performance Optimizations

- **Low Latency Requirements**:
  - Engagement updates: < 500ms
  - API responses: < 2 seconds
  - WebSocket messages: < 100ms

- **Caching Strategy**:
  - CloudFront caches static assets (TTL: 24 hours)
  - API Gateway caches frequent queries (TTL: 5 minutes)
  - Client-side caching for user preferences

- **Database Optimization**:
  - DynamoDB indexes for efficient queries
  - Batch operations for bulk updates
  - Connection pooling for Lambda functions

### 12.3 Capacity Planning

**Design Targets**:
- 1000+ concurrent users
- 50+ simultaneous live classes
- 10,000+ daily active users
- 100,000+ engagement events per hour

## 13. Reliability & Fault Tolerance

### 13.1 High Availability

- **Multi-AZ Deployment**: AWS managed services across availability zones
- **Redundancy**: No single point of failure
- **Failover**: Automatic failover for managed services

### 13.2 Error Handling

- **Graceful Degradation**: Non-critical features degrade without breaking core functionality
- **Retry Mechanisms**: Exponential backoff for transient failures
- **Circuit Breakers**: Prevent cascading failures
- **Error Logging**: Comprehensive error tracking

### 13.3 Data Protection

- **Regular Backups**: DynamoDB point-in-time recovery enabled
- **S3 Versioning**: Historical data preservation
- **Disaster Recovery**: Cross-region backup strategy

### 13.4 Monitoring & Observability

- **CloudWatch Metrics**: System health monitoring
- **CloudWatch Logs**: Centralized logging
- **X-Ray Tracing**: Distributed tracing for debugging
- **Alarms**: Automated alerts for anomalies

## 14. Data Flow Summary

### 14.1 User Authentication Flow

1. User navigates to LumiX web application
2. User enters credentials
3. Frontend sends authentication request to Cognito
4. Cognito validates credentials
5. Cognito returns JWT tokens
6. Frontend stores tokens and redirects to role-specific dashboard

### 14.2 Live Class Engagement Flow

1. Teacher starts live class via dashboard
2. API Gateway receives request, Lambda creates session
3. Session stored in DynamoDB
4. Students receive notification and join class
5. WebSocket connections established for all participants
6. Student engagement signals captured by frontend
7. Signals sent to Lambda via WebSocket
8. Lambda calculates engagement index in real-time
9. Engagement updates pushed to teacher dashboard via WebSocket
10. If engagement drops below threshold:
    - Alert sent to teacher
    - Focus nudge sent to student
11. Session ends, aggregated data stored for reporting
12. Post-session reports generated and stored in S3

### 14.3 Assignment Workflow

1. Teacher creates assignment via dashboard
2. API Gateway routes to Lambda function
3. Lambda stores assignment in DynamoDB
4. SNS triggers notifications to students
5. Students view assignment in their dashboard
6. Student submits assignment
7. Lambda stores submission in DynamoDB
8. Teacher receives notification
9. Teacher grades assignment
10. Student and parent receive grade notification

### 14.4 Parent Summary Generation

1. Scheduled Lambda function runs weekly
2. Lambda queries DynamoDB for student data
3. Engagement, attendance, and performance data aggregated
4. Summary report generated and stored in S3
5. SES sends email to parent with summary
6. Parent can view detailed report in dashboard

## 15. Design Constraints

### 15.1 Technical Constraints

- **Hackathon Timeline**: Limited development time
- **Budget**: Limited to free-tier or low-cost AWS services
- **Team Size**: Small hackathon team capacity
- **MVP Focus**: Core features prioritized over advanced functionality

### 15.2 Operational Constraints

- **No Dedicated DevOps**: Rely on managed services
- **Limited Testing**: Focus on critical path testing
- **Minimal Documentation**: Essential documentation only

## 16. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React/Vue/Angular SPA | User interface |
| Hosting | Amazon S3 + CloudFront | Static hosting and CDN |
| Authentication | Amazon Cognito | User authentication and authorization |
| API Gateway | Amazon API Gateway | REST and WebSocket APIs |
| Compute | AWS Lambda | Serverless business logic |
| Database | Amazon DynamoDB | NoSQL operational data store |
| Storage | Amazon S3 | File storage and analytics data |
| AI/ML | Amazon Rekognition | Engagement signal processing |
| Analytics | Amazon QuickSight | Reporting and visualization |
| Notifications | Amazon SNS + SES | Push notifications and email |
| Monitoring | CloudWatch + X-Ray | Logging, metrics, and tracing |

## 17. Future Design Enhancements

The following enhancements are out of scope for the MVP but may be considered for future iterations:

- **AI-Driven Personalized Learning Paths**: Adaptive content recommendations
- **LMS Integrations**: Canvas, Moodle, Blackboard integration
- **Multi-Language Support**: Internationalization and localization
- **Offline Data Synchronization**: Progressive web app with offline capabilities
- **Gamification Modules**: Badges, leaderboards, achievements
- **Parent-Teacher Scheduling Workflows**: Automated meeting scheduling
- **Advanced Analytics**: Predictive analytics, trend forecasting
- **Mobile Native Apps**: iOS and Android applications
- **Video Conferencing Integration**: Built-in video calling
- **Content Management System**: Resource library with versioning

## 18. Design Validation

### 18.1 Requirements Traceability

This design addresses all functional requirements from the requirements document:

- ✅ Authentication & Role Management (Section 5)
- ✅ Teacher Portal Features (Sections 4, 6, 7, 9)
- ✅ Student Portal Features (Sections 4, 6, 7)
- ✅ Parent Portal Features (Sections 4, 9, 10)
- ✅ Engagement Monitoring & Privacy (Section 7, 11)
- ✅ Non-Functional Requirements (Sections 11, 12, 13)

### 18.2 Design Principles Validation

- ✅ **Real-Time Capability**: WebSocket architecture supports real-time updates
- ✅ **Role-Based Access**: Cognito and API Gateway enforce RBAC
- ✅ **Privacy-First**: No storage of sensitive data, transient processing
- ✅ **Scalability**: Serverless architecture auto-scales
- ✅ **Low Latency**: Optimized data flow and caching strategies
- ✅ **Cloud-Native**: AWS managed services throughout

---

**Document Version**: 1.0  
**Last Updated**: February 8, 2026  
**Status**: Draft for Hackathon Development
