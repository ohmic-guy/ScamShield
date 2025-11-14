from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import os
from Database.database import SessionLocal, DatabaseManager

router = APIRouter()

# Pydantic models for request/response
class LoginRequest(BaseModel):
    phone_number: str
    password: Optional[str] = None
    complaint_id: Optional[str] = None
    role: str  # "victim", "police", "bank"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
    role: str

class OTPRequest(BaseModel):
    phone_number: str
    complaint_id: str

class OTPVerifyRequest(BaseModel):
    phone_number: str
    complaint_id: str
    otp_code: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    User login endpoint.
    For demo: accepts any valid phone number.
    In production: verify password/OTP here.
    """
    try:
        # Check if user exists or create
        user = DatabaseManager.create_or_get_user(
            db,
            {
                "phone_number": request.phone_number,
                "role": request.role,
                "full_name": f"{request.role.title()} User"
            }
        )
        
        # Demo: generate simple token (use JWT in production)
        token = f"token_{user.id}_{int(datetime.utcnow().timestamp())}"
        
        return LoginResponse(
            access_token=token,
            token_type="bearer",
            user={
                "id": user.id,
                "phone_number": user.phone_number,
                "role": user.role,
                "full_name": user.full_name
            },
            role=request.role
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/request-otp")
async def request_otp(request: OTPRequest, db: Session = Depends(get_db)):
    """
    Request OTP for victim complaint access.
    In production: send SMS with OTP.
    """
    try:
        from Database.schema import OTP
        import random
        import string
        
        # Generate random OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        
        # Create OTP record
        otp = OTP(
            phone_number=request.phone_number,
            complaint_id=request.complaint_id,
            otp_code=otp_code,
            expires_at=datetime.utcnow() + timedelta(minutes=5),
            is_verified=False
        )
        db.add(otp)
        db.commit()
        
        # TODO: Send OTP via SMS
        # sms_service.send(request.phone_number, f"Your OTP is: {otp_code}")
        
        return {
            "message": "OTP sent to your phone",
            "expires_in": 300,  # 5 minutes in seconds
            "phone": request.phone_number[-2:] + "****" + request.phone_number[-2:] if len(request.phone_number) > 4 else "****"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest, db: Session = Depends(get_db)):
    """
    Verify OTP for complaint access.
    """
    try:
        is_valid = DatabaseManager.verify_otp(
            db,
            request.phone_number,
            request.complaint_id,
            request.otp_code
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired OTP"
            )
        
        # Generate token
        token = f"victim_token_{request.complaint_id}_{int(datetime.utcnow().timestamp())}"
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "complaint_id": request.complaint_id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout")
async def logout(token: str = None):
    """
    Logout endpoint (invalidates token).
    In production: add token to blacklist.
    """
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """
    Get current user info from token.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Demo: extract user_id from token (use JWT decode in production)
    try:
        user_id = int(token.split('_')[1])
        from Database.schema import User
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user.id,
            "phone_number": user.phone_number,
            "role": user.role,
            "full_name": user.full_name
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
