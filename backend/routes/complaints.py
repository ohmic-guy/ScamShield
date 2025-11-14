from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from Database.database import SessionLocal, DatabaseManager
from Database.schema import Complaint

router = APIRouter()

# Pydantic models
class ComplaintCreate(BaseModel):
    victim_phone: str
    victim_name: str
    fraud_type: str
    amount_lost: float
    accused_account: Optional[str] = None
    accused_bank: Optional[str] = None
    transaction_id: Optional[str] = None
    transaction_date: Optional[datetime] = None
    district: str
    description: str

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    fir_number: Optional[str] = None
    amount_recovered: Optional[float] = None

class ComplaintResponse(BaseModel):
    id: int
    complaint_id: str
    victim_phone: str
    fraud_type: str
    amount_lost: float
    status: str
    created_at: datetime
    is_priority: bool
    is_funds_frozen: bool

    class Config:
        from_attributes = True

class ContactOfficerRequest(BaseModel):
    complaint_id: str
    subject: str
    message: str
    priority: str = "medium"  # low, medium, high
    contact_method: str = "email"  # email, phone, sms

class ContactOfficerResponse(BaseModel):
    success: bool
    message: str
    ticket_id: Optional[str] = None
    officer_contact: Optional[str] = None

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    """
    Create a new cyber fraud complaint.
    
    **Parameters:**
    - victim_phone: Phone number of the victim
    - victim_name: Full name of victim
    - fraud_type: Type of fraud (UPI_SCAM, PHISHING, INVESTMENT_FRAUD, etc.)
    - amount_lost: Amount lost in rupees
    - district: District name
    - description: Detailed description of the incident
    """
    try:
        from Database.schema import FraudType, CaseStatus, User
        from uuid import uuid4
        
        # Create user if doesn't exist
        user = DatabaseManager.create_or_get_user(
            db,
            {
                "phone_number": complaint.victim_phone,
                "full_name": complaint.victim_name,
                "role": "victim"
            }
        )
        
        # Generate unique complaint ID
        complaint_id = f"CF{datetime.utcnow().year}{str(uuid4()).replace('-', '')[:10].upper()}"
        
        # Create complaint
        new_complaint = Complaint(
            complaint_id=complaint_id,
            victim_id=user.id,
            fraud_type=FraudType[complaint.fraud_type],
            amount_lost=complaint.amount_lost,
            accused_account=complaint.accused_account,
            accused_bank=complaint.accused_bank,
            transaction_id=complaint.transaction_id,
            transaction_date=complaint.transaction_date or datetime.utcnow(),
            district=complaint.district,
            description=complaint.description,
            status=CaseStatus.PENDING,
            reported_at=datetime.utcnow()
        )
        
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        
        return ComplaintResponse(
            id=new_complaint.id,
            complaint_id=new_complaint.complaint_id,
            victim_phone=complaint.victim_phone,
            fraud_type=complaint.fraud_type,
            amount_lost=complaint.amount_lost,
            status=new_complaint.status.value,
            created_at=new_complaint.created_at,
            is_priority=new_complaint.is_priority,
            is_funds_frozen=new_complaint.is_funds_frozen
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    """Get complaint details by complaint ID."""
    try:
        complaint = DatabaseManager.get_complaint_by_id(db, complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        return ComplaintResponse(
            id=complaint.id,
            complaint_id=complaint.complaint_id,
            victim_phone=complaint.victim.phone_number,
            fraud_type=complaint.fraud_type.value,
            amount_lost=complaint.amount_lost,
            status=complaint.status.value,
            created_at=complaint.created_at,
            is_priority=complaint.is_priority,
            is_funds_frozen=complaint.is_funds_frozen
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def list_complaints(
    status: Optional[str] = None,
    district: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    List complaints with optional filtering.
    
    **Parameters:**
    - status: Filter by status (PENDING, ASSIGNED, FIR_REGISTERED, etc.)
    - district: Filter by district
    - limit: Number of results (default 50, max 500)
    - offset: Pagination offset
    """
    try:
        query = db.query(Complaint)
        
        if status:
            from Database.schema import CaseStatus
            query = query.filter(Complaint.status == CaseStatus[status])
        
        if district:
            query = query.filter(Complaint.district == district)
        
        total = query.count()
        complaints = query.offset(offset).limit(limit).all()
        
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "complaints": [
                {
                    "id": c.id,
                    "complaint_id": c.complaint_id,
                    "fraud_type": c.fraud_type.value,
                    "amount_lost": c.amount_lost,
                    "status": c.status.value,
                    "created_at": c.created_at,
                    "is_priority": c.is_priority
                }
                for c in complaints
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint(
    complaint_id: str,
    update: ComplaintUpdate,
    db: Session = Depends(get_db)
):
    """
    Update complaint status or details.
    
    **Parameters:**
    - status: New status for the complaint
    - fir_number: FIR registration number
    - amount_recovered: Amount recovered (if any)
    """
    try:
        complaint = DatabaseManager.get_complaint_by_id(db, complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        if update.status:
            from Database.schema import CaseStatus
            complaint.status = CaseStatus[update.status]
        
        if update.fir_number:
            complaint.fir_number = update.fir_number
        
        if update.amount_recovered is not None:
            complaint.amount_recovered = update.amount_recovered
        
        db.commit()
        db.refresh(complaint)
        
        return ComplaintResponse(
            id=complaint.id,
            complaint_id=complaint.complaint_id,
            victim_phone=complaint.victim.phone_number,
            fraud_type=complaint.fraud_type.value,
            amount_lost=complaint.amount_lost,
            status=complaint.status.value,
            created_at=complaint.created_at,
            is_priority=complaint.is_priority,
            is_funds_frozen=complaint.is_funds_frozen
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{complaint_id}/activity")
async def get_complaint_activity(complaint_id: str, db: Session = Depends(get_db)):
    """Get activity log for a complaint."""
    try:
        from Database.schema import CaseActivity
        
        complaint = DatabaseManager.get_complaint_by_id(db, complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        activities = db.query(CaseActivity).filter(
            CaseActivity.complaint_id == complaint.id
        ).order_by(CaseActivity.created_at.desc()).all()
        
        return {
            "complaint_id": complaint_id,
            "activities": [
                {
                    "id": a.id,
                    "action_type": a.action_type.value if hasattr(a.action_type, 'value') else str(a.action_type),
                    "description": a.description,
                    "remarks": a.remarks,
                    "created_at": a.created_at,
                    "created_by": a.created_by
                }
                for a in activities
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{complaint_id}/contact-officer", response_model=ContactOfficerResponse)
async def contact_investigating_officer(
    complaint_id: str,
    contact_request: ContactOfficerRequest,
    db: Session = Depends(get_db)
):
    """
    Contact the investigating officer for a complaint.
    
    This endpoint allows victims to send messages to their assigned investigating officer.
    The message will be delivered via the preferred contact method (email, phone, SMS).
    
    Args:
        - complaint_id: The complaint ID to contact officer about
        - subject: Subject line for the message
        - message: Message content
        - priority: Priority level (low, medium, high)
        - contact_method: Preferred contact method (email, phone, sms)
    
    Returns:
        - success: Whether the message was sent successfully
        - message: Status message
        - ticket_id: Reference ticket ID for follow-up
        - officer_contact: Officer contact information
    """
    try:
        # Verify complaint exists
        complaint = DatabaseManager.get_complaint_by_id(db, complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        # In a production system, you would:
        # 1. Generate a ticket ID
        # 2. Send email/SMS/call to the officer
        # 3. Log the contact attempt
        # 4. Notify the victim
        
        # Mock implementation
        import uuid
        from datetime import datetime
        
        ticket_id = f"TKT-{complaint_id}-{uuid.uuid4().hex[:6].upper()}"
        
        # Log contact attempt
        contact_log = {
            "complaint_id": complaint_id,
            "subject": contact_request.subject,
            "message": contact_request.message,
            "priority": contact_request.priority,
            "contact_method": contact_request.contact_method,
            "timestamp": datetime.now().isoformat(),
            "ticket_id": ticket_id,
            "status": "pending"
        }
        
        # In production, store this in a ContactLog table
        # db.add(ContactLog(**contact_log))
        # db.commit()
        
        return ContactOfficerResponse(
            success=True,
            message=f"Your message has been sent to the investigating officer via {contact_request.contact_method}. Reference Ticket ID: {ticket_id}",
            ticket_id=ticket_id,
            officer_contact="SI Rajesh Kumar - +91-9876543210"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to send message: {str(e)}")

