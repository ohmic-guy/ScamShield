from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from Database.database import SessionLocal, DatabaseManager

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/summary")
async def get_analytics_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    district: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get analytics summary for complaints.
    
    **Parameters:**
    - start_date: Start date (YYYY-MM-DD format), defaults to 30 days ago
    - end_date: End date (YYYY-MM-DD format), defaults to today
    - district: Filter by specific district
    
    **Returns:**
    - total_cases: Total number of cases
    - total_lost: Total amount lost
    - total_recovered: Total amount recovered
    - resolved: Number of resolved cases
    - pending: Number of pending cases
    """
    try:
        # Parse dates
        if end_date:
            end = datetime.strptime(end_date, "%Y-%m-%d")
        else:
            end = datetime.now()
        
        if start_date:
            start = datetime.strptime(start_date, "%Y-%m-%d")
        else:
            start = end - timedelta(days=30)
        
        summary = DatabaseManager.get_analytics_summary(db, start, end, district)
        
        if not summary:
            return {
                "total_cases": 0,
                "total_lost": 0,
                "total_recovered": 0,
                "resolved": 0,
                "pending": 0,
                "period": {
                    "start_date": start.date(),
                    "end_date": end.date(),
                    "district": district or "all"
                }
            }
        
        return {
            "total_cases": summary[0] or 0,
            "total_lost": float(summary[1] or 0),
            "total_recovered": float(summary[2] or 0),
            "resolved": summary[3] or 0,
            "pending": summary[4] or 0,
            "recovery_rate": f"{((float(summary[2] or 0) / float(summary[1] or 1)) * 100):.2f}%",
            "period": {
                "start_date": start.date(),
                "end_date": end.date(),
                "district": district or "all"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/by-status")
async def get_cases_by_status(
    status: str = Query(..., description="Case status (PENDING, ASSIGNED, FIR_REGISTERED, REFUNDED)"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Get cases filtered by status with pagination.
    
    **Parameters:**
    - status: Filter by status
    - limit: Number of results (max 500)
    - offset: Pagination offset
    """
    try:
        cases = DatabaseManager.get_cases_by_status(db, status, limit, offset)
        
        return {
            "status": status,
            "limit": limit,
            "offset": offset,
            "total": len(cases),
            "cases": [
                {
                    "complaint_id": c.complaint_id,
                    "fraud_type": c.fraud_type.value if hasattr(c.fraud_type, 'value') else str(c.fraud_type),
                    "amount_lost": c.amount_lost,
                    "amount_recovered": c.amount_recovered or 0,
                    "created_at": c.created_at,
                    "is_priority": c.is_priority
                }
                for c in cases
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/fraud-types")
async def get_fraud_type_statistics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get statistics grouped by fraud type.
    
    Shows the count and total amount for each fraud type.
    """
    try:
        from Database.schema import Complaint
        from sqlalchemy import func
        
        # Parse dates
        if end_date:
            end = datetime.strptime(end_date, "%Y-%m-%d")
        else:
            end = datetime.now()
        
        if start_date:
            start = datetime.strptime(start_date, "%Y-%m-%d")
        else:
            start = end - timedelta(days=30)
        
        # Query fraud types
        query = db.query(
            Complaint.fraud_type,
            func.count(Complaint.id).label('count'),
            func.sum(Complaint.amount_lost).label('total_amount')
        ).filter(
            Complaint.created_at >= start,
            Complaint.created_at <= end
        ).group_by(Complaint.fraud_type)
        
        results = query.all()
        
        return {
            "period": {
                "start_date": start.date(),
                "end_date": end.date()
            },
            "fraud_types": [
                {
                    "fraud_type": r[0].value if hasattr(r[0], 'value') else str(r[0]),
                    "count": r[1],
                    "total_amount": float(r[2] or 0),
                    "average_amount": float((r[2] or 0) / r[1]) if r[1] > 0 else 0
                }
                for r in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/by-district")
async def get_cases_by_district(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get statistics grouped by district.
    """
    try:
        from Database.schema import Complaint
        from sqlalchemy import func
        
        # Parse dates
        if end_date:
            end = datetime.strptime(end_date, "%Y-%m-%d")
        else:
            end = datetime.now()
        
        if start_date:
            start = datetime.strptime(start_date, "%Y-%m-%d")
        else:
            start = end - timedelta(days=30)
        
        # Query by district
        query = db.query(
            Complaint.district,
            func.count(Complaint.id).label('count'),
            func.sum(Complaint.amount_lost).label('total_lost'),
            func.sum(Complaint.amount_recovered).label('total_recovered')
        ).filter(
            Complaint.created_at >= start,
            Complaint.created_at <= end
        ).group_by(Complaint.district).order_by(func.count(Complaint.id).desc())
        
        results = query.all()
        
        return {
            "period": {
                "start_date": start.date(),
                "end_date": end.date()
            },
            "districts": [
                {
                    "district": r[0],
                    "cases": r[1],
                    "total_lost": float(r[2] or 0),
                    "total_recovered": float(r[3] or 0),
                    "recovery_rate": f"{((float(r[3] or 0) / float(r[2] or 1)) * 100):.2f}%"
                }
                for r in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/priority-cases")
async def get_priority_cases(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Get high-priority cases (organized fraud patterns detected).
    """
    try:
        from Database.schema import Complaint
        
        query = db.query(Complaint).filter(Complaint.is_priority == True)
        total = query.count()
        cases = query.order_by(Complaint.created_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "priority_cases": [
                {
                    "complaint_id": c.complaint_id,
                    "fraud_type": c.fraud_type.value if hasattr(c.fraud_type, 'value') else str(c.fraud_type),
                    "amount_lost": c.amount_lost,
                    "accused_account": c.accused_account[-4:] + "****" if c.accused_account else None,
                    "accused_bank": c.accused_bank,
                    "created_at": c.created_at
                }
                for c in cases
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
