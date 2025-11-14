from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
import os
from typing import Generator

# Database Configuration
# SQLite database - stored in project directory
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./cyber_fraud.db"
)

# For PostgreSQL, use:
# DATABASE_URL = "postgresql://user:password@localhost:5432/cyber_fraud_db"
# For MySQL, use:
# DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/cyber_fraud_db"

# Create SQLAlchemy engine
# SQLite specific: check_same_thread=False allows multiple threads
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False,  # Set to True for SQL query logging
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Dependency for FastAPI
def get_db() -> Generator[Session, None, None]:
    """
    Dependency function that yields database sessions.
    Use with FastAPI: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Context manager for standalone scripts
@contextmanager
def get_db_context():
    """
    Context manager for database sessions in standalone scripts.
    
    Usage:
        with get_db_context() as db:
            # perform database operations
            pass
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def init_db():
    """
    Initialize database tables.
    Run this once to create all tables defined in schema.py
    """
    from schema import Base
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def drop_db():
    """
    Drop all database tables.
    WARNING: This will delete all data!
    """
    from schema import Base
    Base.metadata.drop_all(bind=engine)
    print("Database tables dropped successfully!")

def reset_db():
    """
    Drop and recreate all database tables.
    WARNING: This will delete all data!
    """
    drop_db()
    init_db()

# Database utility functions
class DatabaseManager:
    """Helper class for common database operations"""
    
    @staticmethod
    def create_complaint(db: Session, complaint_data: dict):
        """Create a new complaint record"""
        from schema import Complaint
        complaint = Complaint(**complaint_data)
        db.add(complaint)
        db.commit()
        db.refresh(complaint)
        return complaint
    
    @staticmethod
    def get_complaint_by_id(db: Session, complaint_id: str):
        """Retrieve complaint by complaint_id"""
        from schema import Complaint
        return db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()
    
    @staticmethod
    def update_complaint_status(db: Session, complaint_id: str, new_status: str):
        """Update complaint status"""
        from schema import Complaint, CaseStatus
        complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()
        if complaint:
            complaint.status = CaseStatus[new_status]
            db.commit()
            db.refresh(complaint)
        return complaint
    
    @staticmethod
    def add_case_activity(db: Session, activity_data: dict):
        """Add a new case activity log"""
        from schema import CaseActivity
        activity = CaseActivity(**activity_data)
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
    
    @staticmethod
    def create_bank_action(db: Session, bank_action_data: dict):
        """Create a bank action record"""
        from schema import BankAction
        bank_action = BankAction(**bank_action_data)
        db.add(bank_action)
        db.commit()
        db.refresh(bank_action)
        return bank_action
    
    @staticmethod
    def send_notification(db: Session, notification_data: dict):
        """Create a notification record"""
        from schema import Notification
        notification = Notification(**notification_data)
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    
    @staticmethod
    def get_user_by_phone(db: Session, phone_number: str):
        """Retrieve user by phone number"""
        from schema import User
        return db.query(User).filter(User.phone_number == phone_number).first()
    
    @staticmethod
    def create_or_get_user(db: Session, user_data: dict):
        """Create a new user or return existing user"""
        from schema import User
        user = db.query(User).filter(User.phone_number == user_data['phone_number']).first()
        if not user:
            user = User(**user_data)
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    @staticmethod
    def verify_otp(db: Session, phone_number: str, complaint_id: str, otp_code: str):
        """Verify OTP for complaint access"""
        from schema import OTP
        from datetime import datetime
        
        otp_record = db.query(OTP).filter(
            OTP.phone_number == phone_number,
            OTP.complaint_id == complaint_id,
            OTP.otp_code == otp_code,
            OTP.is_verified == False,
            OTP.expires_at > datetime.utcnow()
        ).first()
        
        if otp_record:
            otp_record.is_verified = True
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_analytics_summary(db: Session, start_date=None, end_date=None, district=None):
        """Get analytics summary with optional filters"""
        from schema import Complaint, CaseStatus
        from sqlalchemy import func
        
        query = db.query(
            func.count(Complaint.id).label('total_cases'),
            func.sum(Complaint.amount_lost).label('total_lost'),
            func.sum(Complaint.amount_recovered).label('total_recovered'),
            func.count(func.case([(Complaint.status == CaseStatus.REFUNDED, 1)])).label('resolved'),
            func.count(func.case([(Complaint.status == CaseStatus.PENDING, 1)])).label('pending')
        )
        
        if start_date:
            query = query.filter(Complaint.created_at >= start_date)
        if end_date:
            query = query.filter(Complaint.created_at <= end_date)
        if district:
            query = query.filter(Complaint.district == district)
        
        return query.first()
    
    @staticmethod
    def get_cases_by_status(db: Session, status: str, limit: int = 100, offset: int = 0):
        """Get complaints filtered by status with pagination"""
        from schema import Complaint, CaseStatus
        return db.query(Complaint).filter(
            Complaint.status == CaseStatus[status]
        ).offset(offset).limit(limit).all()

# Database health check
def check_db_connection():
    """Check if database connection is working"""
    try:
        with get_db_context() as db:
            db.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

if __name__ == "__main__":
    # Initialize database when run directly
    print("Initializing database...")
    init_db()
    print("Checking database connection...")
    if check_db_connection():
        print("Database is ready!")
    else:
        print("Database connection failed!")