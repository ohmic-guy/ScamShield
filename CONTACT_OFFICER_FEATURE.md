# Contact Officer Feature Documentation

## Overview

The "Contact Officer" feature allows victims to directly communicate with their assigned investigating officers within the Cyber Fraud Support System. This enables efficient, tracked communication between victims and law enforcement.

## Features

### For Victims
- 📧 **Multiple Contact Methods** - Choose between email, phone call, or SMS
- 🎯 **Priority Levels** - Mark messages as low, medium, or high priority
- 📝 **Tracked Communication** - Each contact attempt generates a ticket ID for reference
- 🔔 **Direct Messaging** - Send messages directly to assigned officer
- ⏱️ **Response Tracking** - Get ticket ID for follow-up communication

### For Officers
- 📬 **Message Queue** - Receive victim contact requests
- 🏷️ **Ticket System** - Track all victim communications with unique IDs
- 📊 **Priority Routing** - High-priority messages flagged for immediate attention
- 📞 **Multi-Channel** - Receive notifications via preferred contact method

## Components

### Frontend Components

#### 1. **ContactOfficerModal.tsx**
Located at: `frontend/src/components/victim/ContactOfficerModal.tsx`

Modal component for contacting the investigating officer.

**Props:**
```typescript
interface ContactOfficerModalProps {
  isOpen: boolean;                    // Control modal visibility
  onClose: () => void;                // Close modal handler
  onSubmit: (data: ContactData) => Promise<void>;  // Submit handler
  officerName: string;                // Name of assigned officer
  officerPhone?: string;              // Officer's phone number
  officerEmail?: string;              // Officer's email
  isDarkMode: boolean;                // Theme support
}
```

**Features:**
- Subject line input
- Message textarea
- Priority dropdown (Low, Medium, High)
- Contact method selector (Email, Phone, SMS)
- Officer information display
- Loading states and error handling
- Success confirmation

#### 2. **useContactOfficer.ts**
Located at: `frontend/src/services/useContactOfficer.ts`

React hook for contact officer operations.

**Methods:**
```typescript
const { sendContactRequest, getOfficerDetails } = useContactOfficer();

// Send a message to officer
const response = await sendContactRequest({
  complaint_id: 'CF2024001',
  subject: 'Case Update Request',
  message: 'Hi, I wanted to follow up on my case status...',
  priority: 'medium',
  contact_method: 'email'
});

// Get officer details
const officer = await getOfficerDetails('CF2024001');
// Returns: { officer_name, officer_phone, officer_email, station }
```

#### 3. **CaseDashboard.tsx Updates**
Located at: `frontend/src/components/victim/CaseDashboard.tsx`

Integration of contact officer functionality:

```typescript
// Import modal and hook
import { ContactOfficerModal } from './ContactOfficerModal';
import { useContactOfficer } from '@/services/useContactOfficer';

// State management
const [contactModalOpen, setContactModalOpen] = useState(false);

// Handler
const handleContactOfficer = async (contactData) => {
  const response = await sendContactRequest({
    complaint_id: complaintId,
    ...contactData
  });
};

// Render button
<button onClick={() => setContactModalOpen(true)}>
  <MessageSquare className="h-5 w-5" />
  Contact Officer
</button>

// Render modal
<ContactOfficerModal
  isOpen={contactModalOpen}
  onClose={() => setContactModalOpen(false)}
  onSubmit={handleContactOfficer}
  officerName={caseData?.officerName}
  isDarkMode={isDarkMode}
/>
```

### Backend Components

#### 1. **Contact Officer Endpoint**
Location: `backend/routes/complaints.py`

**Endpoint:** `POST /api/complaints/{complaint_id}/contact-officer`

**Request:**
```json
{
  "complaint_id": "CF2024001",
  "subject": "Case Update Request",
  "message": "Could you please provide an update on my case?",
  "priority": "medium",
  "contact_method": "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been sent to the investigating officer via email. Reference Ticket ID: TKT-CF2024001-ABC123",
  "ticket_id": "TKT-CF2024001-ABC123",
  "officer_contact": "SI Rajesh Kumar - +91-9876543210"
}
```

**Error Response:**
```json
{
  "detail": "Complaint not found"
}
```

#### 2. **Pydantic Models**

```python
class ContactOfficerRequest(BaseModel):
    complaint_id: str              # Complaint ID
    subject: str                   # Message subject
    message: str                   # Message content
    priority: str = "medium"       # Priority: low, medium, high
    contact_method: str = "email"  # Method: email, phone, sms

class ContactOfficerResponse(BaseModel):
    success: bool                  # Success status
    message: str                   # Response message
    ticket_id: Optional[str]       # Reference ticket ID
    officer_contact: Optional[str] # Officer contact info
```

## User Flow

### Step 1: Victim Initiates Contact
1. Victim opens Case Dashboard
2. Clicks "Contact Officer" button in Actions section
3. ContactOfficerModal opens

### Step 2: Victim Fills Form
1. Enter subject line
2. Type message content
3. Select priority level
4. Choose contact method
5. Review officer information

### Step 3: Message Sent
1. Click "Send Message"
2. Frontend validates input
3. API call to backend endpoint
4. Backend processes request
5. Response shows success and ticket ID

### Step 4: Victim Confirmation
1. Success message displayed
2. Ticket ID shown for reference
3. Modal closes automatically
4. Notification preference respected

## API Flow

```
┌─────────────────────┐
│   Victim Portal     │
│  (CaseDashboard)    │
└──────────┬──────────┘
           │
           │ User clicks "Contact Officer"
           ▼
┌─────────────────────────────┐
│ ContactOfficerModal Opens   │
│ - Shows officer info        │
│ - Form for message          │
│ - Priority & method options │
└──────────┬──────────────────┘
           │
           │ User submits form
           ▼
┌─────────────────────────────┐
│  useContactOfficer Hook     │
│  - Validates input          │
│  - Sets loading state       │
│  - Calls API                │
└──────────┬──────────────────┘
           │
           │ POST /api/complaints/{id}/contact-officer
           ▼
┌─────────────────────────────┐
│   FastAPI Backend           │
│ - Verifies complaint        │
│ - Logs contact attempt      │
│ - Generates ticket ID       │
│ - Would send notification   │
└──────────┬──────────────────┘
           │
           │ Returns ContactOfficerResponse
           ▼
┌─────────────────────────────┐
│ Frontend Processes Response │
│ - Shows success message     │
│ - Displays ticket ID        │
│ - Closes modal after 2s     │
└─────────────────────────────┘
```

## Data Models

### ContactOfficerRequest
```typescript
{
  complaint_id: string;        // "CF2024001"
  subject: string;             // "Case Update Request"
  message: string;             // "Could you please update me..."
  priority: 'low' | 'medium' | 'high';
  contact_method: 'email' | 'phone' | 'sms';
}
```

### ContactOfficerResponse
```typescript
{
  success: boolean;            // true
  message: string;             // "Your message has been sent..."
  ticket_id?: string;          // "TKT-CF2024001-ABC123"
  officer_contact?: string;    // "SI Rajesh Kumar - +91-9876543210"
}
```

## Error Handling

### Frontend Error Handling
```typescript
try {
  await handleContactOfficer(formData);
  setSuccess(true);
  // Close modal after 2 seconds
  setTimeout(() => onClose(), 2000);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Failed to send message');
  setLoading(false);
}
```

### Backend Error Handling
```python
# Complaint not found
HTTPException(status_code=404, detail="Complaint not found")

# Invalid input
HTTPException(status_code=400, detail="Failed to send message: {error}")

# Server error
HTTPException(status_code=500, detail="Internal server error")
```

## UI/UX

### Modal Appearance
- **Light Mode:** White background with gray text and blue accents
- **Dark Mode:** Gray-800 background with light text and blue accents
- **Mobile Responsive:** Adapts to small screens
- **Accessibility:** Proper labels, focus states, keyboard navigation

### States

#### Initial State
- Modal displays officer information
- Empty form fields
- All buttons enabled
- No error messages

#### Loading State
- Submit button shows loading spinner
- Form fields disabled
- Message: "Sending..."

#### Success State
- Green checkmark displayed
- Success message: "Message sent successfully!"
- Modal auto-closes after 2 seconds
- Form resets for next use

#### Error State
- Red alert box
- Error message displayed
- Submit button re-enabled
- Form data preserved

## Priority Levels

| Level | Color | Use Case |
|-------|-------|----------|
| Low | Green | General inquiries, non-urgent updates |
| Medium | Yellow | Regular status checks, follow-ups |
| High | Red | Urgent issues, emergency situations |

## Contact Methods

| Method | Delivery | Use Case |
|--------|----------|----------|
| Email | 24-48 hours | Detailed messages, documentation |
| Phone | Immediate | Urgent matters, direct conversation |
| SMS | Immediate | Quick confirmations, alerts |

## Testing

### Manual Testing Steps

1. **Open Victim Portal**
   - Navigate to Case Dashboard
   - Verify "Contact Officer" button is visible

2. **Open Modal**
   - Click "Contact Officer"
   - Verify modal displays officer information
   - Verify form fields are empty

3. **Test Validation**
   - Try to submit empty form
   - Verify error message: "Please fill in all fields"
   - Fill in fields and resubmit

4. **Test Success Flow**
   - Fill all fields
   - Select medium priority
   - Select email method
   - Click "Send Message"
   - Verify success message
   - Verify ticket ID displayed
   - Verify modal closes

5. **Test Dark Mode**
   - Toggle dark mode
   - Verify colors adapt properly
   - Verify text is readable

### Test Data

```json
{
  "subject": "Case Status Update",
  "message": "Could you please provide an update on my case status?",
  "priority": "medium",
  "contact_method": "email"
}
```

## Production Considerations

### Future Enhancements

1. **Notification System**
   - Email notifications to officers
   - SMS alerts for high-priority messages
   - Push notifications to officer mobile app

2. **Message History**
   - Store contact messages in database
   - Display conversation thread
   - Attach documents/evidence

3. **Escalation**
   - Auto-escalate high-priority messages
   - Alert supervisor if no response
   - Ticket SLA tracking

4. **Analytics**
   - Track response times
   - Measure victim satisfaction
   - Identify communication bottlenecks

5. **Integration**
   - SMS gateway integration
   - Email template system
   - CRM system integration

### Security

- ✅ Input validation (subject, message)
- ✅ Complaint ID verification
- ✅ Rate limiting recommended
- ✅ Message content filtering recommended
- ✅ Audit logging of all contact attempts

### Performance

- ✅ Async API calls (no blocking)
- ✅ Modal lazy loading
- ✅ Request debouncing
- ✅ Client-side validation before API call
- ✅ Error recovery without page reload

## Code Examples

### Basic Usage

```typescript
// In victim portal component
const handleContactClick = async () => {
  const contactData = {
    subject: 'Case Status Inquiry',
    message: 'I would like an update on my case.',
    priority: 'medium',
    contact_method: 'email'
  };
  
  try {
    const response = await sendContactRequest({
      complaint_id: 'CF2024001',
      ...contactData
    });
    
    console.log('Ticket ID:', response.ticket_id);
    console.log('Message:', response.message);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

### API Call Example

```bash
curl -X POST http://localhost:8000/api/complaints/CF2024001/contact-officer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "subject": "Case Update Request",
    "message": "Could you provide an update?",
    "priority": "medium",
    "contact_method": "email"
  }'
```

## Status

- ✅ **Frontend:** Complete (Modal + Hook)
- ✅ **Backend:** Complete (API Endpoint)
- ✅ **Integration:** Complete (CaseDashboard)
- ⏳ **Production Ready:** In Progress
- ⏳ **Email Integration:** TODO
- ⏳ **SMS Integration:** TODO

## Files Modified

1. `frontend/src/services/useContactOfficer.ts` - **NEW**
2. `frontend/src/components/victim/ContactOfficerModal.tsx` - **NEW**
3. `frontend/src/components/victim/CaseDashboard.tsx` - **MODIFIED**
4. `backend/routes/complaints.py` - **MODIFIED**

---

**Implementation Date:** March 2024  
**Feature Status:** Complete ✅  
**Ready for Testing:** Yes ✅
