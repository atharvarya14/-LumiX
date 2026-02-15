# Requirements: LumiX – Intelligent Classroom Engagement Platform

## 1. Problem Statement

Teachers lack real-time visibility into student engagement during live and online classes. Disengagement is often identified too late, leading to reduced learning outcomes. Parents also lack timely, actionable insights into their child's engagement, attendance, and academic performance.

## 2. Solution Overview

LumiX is a web-based intelligent classroom platform that provides real-time engagement indicators for teachers, focus feedback for students, and summary analytics for parents using privacy-aware engagement analysis.

## 3. Target Users

- **Teachers** – monitor engagement, manage classes, and receive real-time alerts
- **Students** – access learning resources, receive focus feedback, and track progress
- **Parents** – view engagement summaries, attendance, and academic performance reports

## 4. User Stories & Acceptance Criteria

### 4.1 Authentication & Role Management

#### User Story 4.1.1: Role-Based Authentication
**As a** user (teacher, student, or parent)  
**I want to** authenticate securely with role-based permissions  
**So that** I can access features appropriate to my role

**Acceptance Criteria:**
- System supports three distinct roles: Teacher, Student, Parent
- Users can log in with secure credentials
- Each role has access only to authorized features
- Session management maintains user authentication state
- Unauthorized access attempts are blocked

---

### 4.2 Teacher Portal

#### User Story 4.2.1: Dashboard Overview
**As a** teacher  
**I want to** view key metrics on my dashboard  
**So that** I can quickly assess class status

**Acceptance Criteria:**
- Dashboard displays total number of students
- Dashboard shows active lessons count
- Dashboard presents class performance metrics
- Metrics update in real-time or near real-time

#### User Story 4.2.2: Announcements Management
**As a** teacher  
**I want to** post announcements and updates  
**So that** I can communicate with students and parents

**Acceptance Criteria:**
- Teachers can create new announcements
- Announcements can be targeted to students, parents, or both
- Announcements are visible to intended recipients
- Teachers can edit or delete their announcements

#### User Story 4.2.3: Live Class Management
**As a** teacher  
**I want to** start and manage live classes  
**So that** I can conduct online lessons

**Acceptance Criteria:**
- Teachers can initiate live class sessions
- Teachers can end live class sessions
- Live class status is visible to students
- System tracks session duration

#### User Story 4.2.4: Assignment Management
**As a** teacher  
**I want to** create, assign, and manage assignments  
**So that** I can assess student learning

**Acceptance Criteria:**
- Teachers can create new assignments with descriptions and due dates
- Teachers can assign assignments to specific classes or students
- Teachers can view submission status for each assignment
- Teachers can grade submitted assignments
- Teachers can edit or delete assignments

#### User Story 4.2.5: Attention Reports
**As a** teacher  
**I want to** view a dedicated Attention Reports section  
**So that** I can monitor student engagement status

**Acceptance Criteria:**
- Attention Reports section displays engagement statuses for all students
- Reports show focus scores and engagement trends
- Reports are filterable by class, date, or student
- Data is presented in an easy-to-understand format

#### User Story 4.2.6: Real-Time Engagement Monitoring
**As a** teacher  
**I want to** monitor real-time engagement indicators during live sessions  
**So that** I can identify and address disengagement immediately

**Acceptance Criteria:**
- Engagement indicators update in real-time during live classes
- Visual indicators show engagement levels for each student
- System highlights students with low engagement
- Engagement data is based on presence, interaction, and activity

#### User Story 4.2.7: Student Profile View
**As a** teacher  
**I want to** view individual student profiles  
**So that** I can understand each student's performance holistically

**Acceptance Criteria:**
- Profile displays student's focus score/engagement level
- Profile shows attendance record
- Profile presents academic performance (grades)
- Profile includes historical trends and patterns
- Profile is accessible from multiple views (dashboard, class list, etc.)

#### User Story 4.2.8: Alert System
**As a** teacher  
**I want to** receive alerts for concerning student behaviors  
**So that** I can intervene proactively

**Acceptance Criteria:**
- System generates alerts for low engagement
- System generates alerts for low attention
- System generates alerts for absenteeism
- System generates alerts for student confusion indicators
- Alerts are delivered in real-time or near real-time
- Teachers can configure alert thresholds
- Alert history is maintained

#### User Story 4.2.9: Schedule & Timetable Management
**As a** teacher  
**I want to** view daily schedules, timetables, and lesson plans  
**So that** I can organize my teaching activities

**Acceptance Criteria:**
- Teachers can view their daily schedule
- Timetable displays all classes and timings
- Lesson plans are accessible from the schedule
- Schedule is synchronized with live class sessions

#### User Story 4.2.10: Class Analytics
**As a** teacher  
**I want to** analyze class-wide engagement and performance trends  
**So that** I can improve teaching effectiveness

**Acceptance Criteria:**
- Analytics show class-wide engagement trends over time
- Performance metrics are aggregated and visualized
- Data can be filtered by date range, subject, or class
- Reports are exportable or printable

---

### 4.3 Student Portal

#### User Story 4.3.1: Daily Schedule View
**As a** student  
**I want to** view my daily schedule and timetable on the dashboard  
**So that** I can stay organized and prepared

**Acceptance Criteria:**
- Dashboard displays today's schedule prominently
- Timetable shows all classes with timings
- Upcoming classes are highlighted
- Schedule updates automatically

#### User Story 4.3.2: Live Class Access
**As a** student  
**I want to** join live classes and access learning resources  
**So that** I can participate in lessons

**Acceptance Criteria:**
- Students can join live classes when active
- Learning resources are accessible during and after class
- Join button is visible when class is live
- System tracks student presence in live sessions

#### User Story 4.3.3: Assignment Management
**As a** student  
**I want to** track, submit, and manage assignments  
**So that** I can complete my coursework on time

**Acceptance Criteria:**
- Students can view all assigned assignments
- Assignment list shows due dates and submission status
- Students can submit assignments through the platform
- Students can view grades and feedback on submitted work
- Overdue assignments are clearly marked

#### User Story 4.3.4: Personal Engagement Metrics
**As a** student  
**I want to** view my personal engagement metrics  
**So that** I can understand and improve my focus

**Acceptance Criteria:**
- Dashboard displays personal focus score
- Attendance record is visible
- Performance analytics show trends over time
- Metrics are presented in an encouraging, non-judgmental way

#### User Story 4.3.5: Focus Nudges
**As a** student  
**I want to** receive real-time focus nudges during live sessions  
**So that** I can maintain attention and engagement

**Acceptance Criteria:**
- System sends gentle reminders when focus drops
- Nudges are non-intrusive and respectful
- Nudges are delivered in real-time during live classes
- Students can acknowledge or dismiss nudges

#### User Story 4.3.6: Messaging & Communication
**As a** student  
**I want to** receive messages and alerts from teachers  
**So that** I stay informed about important updates

**Acceptance Criteria:**
- Students receive teacher announcements
- System alerts are delivered for important events
- Students can communicate with teachers via messaging
- Students can communicate with classmates via messaging
- Message history is maintained

---

### 4.4 Parent Portal

#### User Story 4.4.1: Weekly Engagement Summary
**As a** parent  
**I want to** view weekly engagement summaries for my child  
**So that** I can monitor their learning involvement

**Acceptance Criteria:**
- Summary shows weekly focus score trends
- Summary includes engagement highlights and concerns
- Data is presented in parent-friendly language
- Summaries are generated automatically each week

#### User Story 4.4.2: Attendance & Performance Monitoring
**As a** parent  
**I want to** monitor my child's attendance and academic performance  
**So that** I can support their education

**Acceptance Criteria:**
- Attendance record shows all classes and presence status
- Academic performance displays current grades
- Performance trends are visualized over time
- Data is updated regularly

#### User Story 4.4.3: Subject-Wise Reports
**As a** parent  
**I want to** access subject-wise performance and progress reports  
**So that** I can identify strengths and areas for improvement

**Acceptance Criteria:**
- Reports break down performance by subject
- Each subject shows grades, engagement, and trends
- Reports include teacher comments or feedback
- Reports are accessible for current and past periods

#### User Story 4.4.4: Teacher Communication
**As a** parent  
**I want to** receive teacher messages and system alerts  
**So that** I stay informed about my child's education

**Acceptance Criteria:**
- Parents receive messages from teachers
- System alerts are delivered for important events
- Message history is accessible
- Parents can reply to teacher messages

#### User Story 4.4.5: Notification Preferences
**As a** parent  
**I want to** configure notification preferences  
**So that** I receive relevant information in my preferred way

**Acceptance Criteria:**
- Parents can enable/disable low attention alerts (e.g., focus drops below 50%)
- Parents can opt in/out of daily summary emails with focus and grade updates
- Parents can configure assignment reminders and upcoming deadlines
- Parents can enable instant alerts for new teacher messages
- Notification settings are saved and applied consistently
- Parents can choose notification delivery methods (email, in-app, etc.)

---

## 5. Engagement Monitoring & Privacy

### User Story 5.1: Privacy-Aware Engagement Analysis
**As a** system administrator  
**I want to** compute engagement metrics without storing sensitive data  
**So that** user privacy is protected

**Acceptance Criteria:**
- System computes composite engagement index based on:
  - Presence detection
  - Interaction frequency
  - Session activity duration
- Engagement analysis is processed in real-time
- No video, image, or biometric data is stored
- Parents receive summary insights only, not live monitoring feeds
- System complies with data privacy regulations
- Engagement computation is transparent and explainable

---

## 6. Non-Functional Requirements

### 6.1 Performance
- System shall update engagement metrics with low latency (< 2 seconds)
- Platform shall support concurrent users across multiple classes (minimum 1000 concurrent users)
- Real-time features shall have minimal delay (< 500ms for engagement updates)

### 6.2 Security
- Data shall be secured using industry-standard authentication (OAuth 2.0 or similar)
- All data transmission shall use encryption (TLS 1.3 or higher)
- User passwords shall be hashed using strong algorithms (bcrypt, Argon2)
- Role-based access control shall prevent unauthorized access
- System shall implement protection against common vulnerabilities (OWASP Top 10)

### 6.3 Scalability
- System shall be cloud-native and horizontally scalable
- Architecture shall support adding new schools/institutions without redesign
- Database shall handle growing data volumes efficiently

### 6.4 Reliability
- System shall have 99.5% uptime during school hours
- Data shall be backed up regularly
- System shall gracefully handle failures and provide error messages

### 6.5 Usability
- Interface shall be intuitive and require minimal training
- Platform shall be accessible on desktop and mobile devices
- System shall support responsive design for various screen sizes

---

## 7. Future Enhancements

The following features are out of scope for the initial release but may be considered for future iterations:

- AI-driven learning recommendations
- LMS and school management system integration
- Advanced engagement analytics and reports
- Multi-language support
- Offline mode capabilities
- Video conferencing integration
- Gamification elements for student engagement
- Parent-teacher conference scheduling
- Resource library and content management

---

## 8. Constraints & Assumptions

### Constraints
- Development timeline: Hackathon timeframe
- Budget: Limited to free/open-source tools and services
- Team size: Hackathon team capacity

### Assumptions
- Users have reliable internet connectivity
- Users have access to modern web browsers
- Schools/institutions provide necessary user data for onboarding
- Engagement metrics can be derived from user interaction patterns
- Users consent to engagement monitoring as part of platform usage

---

## 9. Success Metrics

- User adoption rate across all three roles (teachers, students, parents)
- Engagement metric accuracy and reliability
- System uptime and performance metrics
- User satisfaction scores
- Reduction in time to identify disengaged students
- Increase in parent involvement in student education
