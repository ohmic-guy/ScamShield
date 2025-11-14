from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from Database.database import SessionLocal, DatabaseManager
from Alerts.alert_authority import AlertAuthorities

router = APIRouter()

# Pydantic models
class TriggerAlertsRequest(BaseModel):
    complaint_id: str

class AlertResponse(BaseModel):
    alert_type: str
    status: bool
    message: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/trigger")
async def trigger_alerts(request: TriggerAlertsRequest, db: Session = Depends(get_db)):
    """
    Trigger alerts for a complaint.
    
    This will:
    1. Check if within golden hour (1 hour of fraud) and send urgent alerts
    2. If high-value fraud (>₹1 lakh), alert senior officials
    3. Send bank freeze request if account info available
    4. Sync with I4C/CFCFRMS national database
    5. Alert local police station
    6. Check for fraud patterns and alert if detected
    
    **Parameters:**
    - complaint_id: ID of the complaint to trigger alerts for
    """
    try:
        complaint = DatabaseManager.get_complaint_by_id(db, request.complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        # Trigger alerts
        alerter = AlertAuthorities(db)
        alerts_result = alerter.trigger_alerts(request.complaint_id)
        
        # Format response
        alerts = []
        for alert_type, success in alerts_result.items():
            alerts.append({
                "alert_type": alert_type,
                "status": success,
                "message": f"Alert '{alert_type}' {'sent successfully' if success else 'failed'}"
            })
        
        return {
            "complaint_id": request.complaint_id,
            "alerts": alerts,
            "summary": {
                "total_alerts": len(alerts),
                "successful": sum(1 for a in alerts if a["status"]),
                "failed": sum(1 for a in alerts if not a["status"])
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/golden-hour")
async def send_golden_hour_alert(request: TriggerAlertsRequest, db: Session = Depends(get_db)):
    """
    Send urgent golden hour alert (for frauds within 1 hour).
    
    This is a high-priority alert sent to Cyber Cell and I4C immediately.
    """
    try:
        complaint = DatabaseManager.get_complaint_by_id(db, request.complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        alerter = AlertAuthorities(db)
        success = alerter._send_golden_hour_alert(complaint)
        
        return {
            "complaint_id": request.complaint_id,
            "alert_type": "golden_hour",
            "status": "sent" if success else "failed",
            "message": "Golden hour alert sent to all authorities" if success else "Failed to send alert"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/bank-freeze")
async def send_bank_freeze_alert(request: TriggerAlertsRequest, db: Session = Depends(get_db)):
    """
    Send urgent bank account freeze request.
    
    Sends freeze request to the accused's bank.
    """
    try:
        complaint = DatabaseManager.get_complaint_by_id(db, request.complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        if not complaint.accused_account or not complaint.accused_bank:
            raise HTTPException(status_code=400, detail="Accused account information missing")
        
        alerter = AlertAuthorities(db)
        success = alerter._send_bank_freeze_request(complaint)
        
        return {
            "complaint_id": request.complaint_id,
            "alert_type": "bank_freeze",
            "status": "sent" if success else "failed",
            "bank": complaint.accused_bank,
            "account": complaint.accused_account[-4:] + "****",  # Masked account
            "message": "Bank freeze request sent" if success else "Failed to send freeze request"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{complaint_id}/status")
async def get_alert_status(complaint_id: str, db: Session = Depends(get_db)):
    """Get the current alert/action status of a complaint."""
    try:
        complaint = DatabaseManager.get_complaint_by_id(db, complaint_id)
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")
        
        return {
            "complaint_id": complaint_id,
            "is_funds_frozen": complaint.is_funds_frozen,
            "is_priority": complaint.is_priority,
            "fir_registered": complaint.fir_number is not None,
            "status": complaint.status.value if hasattr(complaint.status, 'value') else str(complaint.status)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
