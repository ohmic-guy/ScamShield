from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import sqlalchemy.orm as sql_orm
from datetime import datetime
import enum

Base = sql_orm.declarative_base()

class FraudType(enum.Enum):
    UPI_SCAM = "UPI_SCAM"
    PHISHING = "PHISHING"
    ONLINE_SHOPPING = "ONLINE_SHOPPING"
    INVESTMENT_FRAUD = "INVESTMENT_FRAUD"
    LOAN_FRAUD = "LOAN_FRAUD"
    SOCIAL_MEDIA = "SOCIAL_MEDIA"
    JOB_FRAUD = "JOB_FRAUD"
    OTHER = "OTHER"

class CaseStatus(enum.Enum):
    PENDING = "PENDING"
    IN_PROCESS = "IN_PROCESS"
    BANK_ACTION_TAKEN = "BANK_ACTION_TAKEN"
    REFUNDED = "REFUNDED"
    CLOSED = "CLOSED"

class ActionType(enum.Enum):
    COMPLAINT_REGISTERED = "COMPLAINT_REGISTERED"
    FIR_FILED = "FIR_FILED"
    BANK_NOTIFIED = "BANK_NOTIFIED"
    FUNDS_FROZEN = "FUNDS_FROZEN"
    RECOVERY_INITIATED = "RECOVERY_INITIATED"
    REFUND_PROCESSED = "REFUND_PROCESSED"
    CASE_CLOSED = "CASE_CLOSED"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="VICTIM")  # VICTIM, POLICE, BANK_OFFICER, ADMIN
    district = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    complaints = relationship("Complaint", back_populates="victim")
    activities = relationship("CaseActivity", back_populates="user")

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(String(50), unique=True, index=True, nullable=False)  # From 1930/CFCFRMS
    victim_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Case Details
    fraud_type = Column(Enum(FraudType), nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.PENDING)
    amount_lost = Column(Float, nullable=False)
    amount_recovered = Column(Float, default=0.0)
    description = Column(Text)
    
    # Transaction Details
    transaction_id = Column(String(100))
    transaction_date = Column(DateTime)
    victim_account = Column(String(50))
    accused_account = Column(String(50))
    accused_upi = Column(String(100))
    accused_bank = Column(String(100))
    
    # FIR Details
    fir_number = Column(String(50), unique=True, index=True)
    fir_date = Column(DateTime)
    police_station = Column(String(255))
    investigating_officer = Column(String(255))
    officer_contact = Column(String(15))
    
    # Integration IDs
    cfcfrms_id = Column(String(50), index=True)  # I4C system ID
    cctns_id = Column(String(50), index=True)    # State FIR system ID
    npci_reference = Column(String(50))
    
    # Timestamps
    reported_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    
    # Flags
    is_golden_hour = Column(Boolean, default=False)  # Within 1 hour of fraud
    is_funds_frozen = Column(Boolean, default=False)
    is_priority = Column(Boolean, default=False)
    
    # Location
    district = Column(String(100))
    city = Column(String(100))
    
    # Relationships
    victim = relationship("User", back_populates="complaints")
    activities = relationship("CaseActivity", back_populates="complaint", cascade="all, delete-orphan")
    bank_actions = relationship("BankAction", back_populates="complaint", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="complaint", cascade="all, delete-orphan")

class CaseActivity(Base):
    __tablename__ = "case_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    action_type = Column(Enum(ActionType), nullable=False)
    description = Column(Text, nullable=False)
    remarks = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    complaint = relationship("Complaint", back_populates="activities")
    user = relationship("User", back_populates="activities")

class BankAction(Base):
    __tablename__ = "bank_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    
    bank_name = Column(String(255), nullable=False)
    account_number = Column(String(50), nullable=False)
    action_type = Column(String(50), nullable=False)  # FREEZE, UNFREEZE, RECOVERY
    amount = Column(Float)
    
    request_sent_at = Column(DateTime, default=datetime.utcnow)
    response_received_at = Column(DateTime)
    status = Column(String(50), default="PENDING")  # PENDING, SUCCESS, FAILED
    bank_reference = Column(String(100))
    remarks = Column(Text)
    
    # Relationships
    complaint = relationship("Complaint", back_populates="bank_actions")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    
    notification_type = Column(String(50), nullable=False)  # SMS, EMAIL, PUSH
    recipient = Column(String(255), nullable=False)  # Phone or email
    message = Column(Text, nullable=False)
    
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="SENT")  # SENT, DELIVERED, FAILED
    
    # Relationships
    complaint = relationship("Complaint", back_populates="notifications")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    
    total_cases = Column(Integer, default=0)
    cases_resolved = Column(Integer, default=0)
    cases_pending = Column(Integer, default=0)
    total_amount_lost = Column(Float, default=0.0)
    total_amount_recovered = Column(Float, default=0.0)
    
    district = Column(String(100), index=True)
    fraud_type = Column(String(50))
    
    created_at = Column(DateTime, default=datetime.utcnow)

class OTP(Base):
    __tablename__ = "otps"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), nullable=False, index=True)
    otp_code = Column(String(6), nullable=False)
    complaint_id = Column(String(50), nullable=False)
    
    is_verified = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    log_type = Column(String(50), nullable=False)  # API_CALL, ERROR, INTEGRATION
    service = Column(String(100))  # CFCFRMS, CCTNS, NPCI, BANK_API
    request_data = Column(Text)
    response_data = Column(Text)
    status_code = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)