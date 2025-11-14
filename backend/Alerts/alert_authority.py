from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import json

from Database.schema import Complaint, User, CaseActivity, Notification, ActionType, CaseStatus
from Database.database import DatabaseManager

class AlertAuthorities:
    """
    System to alert various authorities based on fraud case parameters.
    Handles alerts to Police, Banks, Cyber Cell, I4C, and Senior Officials.
    """
    
    # Authority Contact Configuration
    AUTHORITIES = {
        "CYBER_CELL": {
            "email": "cybercell.odisha@police.gov.in",
            "phone": "+91-674-2536672",
            "sms_number": "9437001930"
        },
        "I4C_NATIONAL": {
            "email": "complaints@cybercrime.gov.in",
            "api_endpoint": "https://api.cybercrime.gov.in/v1/alerts",
            "phone": "1930"
        },
        "DGP_OFFICE": {
            "email": "dgp.odisha@police.gov.in",
            "phone": "+91-674-2393999"
        },
        "RBI_NODAL": {
            "email": "cybersecurity@rbi.org.in",
            "phone": "1800-111-333"
        }
    }
    
    # Alert Thresholds
    HIGH_AMOUNT_THRESHOLD = 100000  # ₹1 Lakh
    GOLDEN_HOUR_MINUTES = 60
    CRITICAL_FRAUD_TYPES = ["UPI_SCAM", "PHISHING", "INVESTMENT_FRAUD"]
    
    def __init__(self, db: Session):
        self.db = db
    
    def trigger_alerts(self, complaint_id: str) -> Dict[str, bool]:
        """
        Main function to trigger appropriate alerts based on complaint parameters.
        Returns dict of alert types and their success status.
        """
        complaint = DatabaseManager.get_complaint_by_id(self.db, complaint_id)
        if not complaint:
            return {"error": "Complaint not found"}
        
        alerts_sent = {}
        
        # 1. Golden Hour Alert (within 1 hour of fraud)
        if self._is_golden_hour(complaint):
            alerts_sent['golden_hour'] = self._send_golden_hour_alert(complaint)
        
        # 2. High Amount Alert (> ₹1 Lakh)
        if complaint.amount_lost >= self.HIGH_AMOUNT_THRESHOLD:
            alerts_sent['high_amount'] = self._send_high_amount_alert(complaint)
        
        # 3. Bank Freeze Request
        if complaint.accused_account:
            alerts_sent['bank_freeze'] = self._send_bank_freeze_request(complaint)
        
        # 4. I4C/CFCFRMS Integration
        alerts_sent['i4c_sync'] = self._sync_with_i4c(complaint)
        
        # 5. Local Police Station Alert
        alerts_sent['police_station'] = self._alert_police_station(complaint)
        
        # 6. District Cyber Cell
        alerts_sent['district_cyber_cell'] = self._alert_district_cyber_cell(complaint)
        
        # 7. Pattern Detection Alert (if multiple similar cases)
        if self._detect_pattern(complaint):
            alerts_sent['pattern_alert'] = self._send_pattern_alert(complaint)
        
        return alerts_sent
    
    def _is_golden_hour(self, complaint: Complaint) -> bool:
        """Check if complaint is within golden hour (1 hour of fraud)"""
        if not complaint.transaction_date:
            return False
        time_diff = datetime.utcnow() - complaint.transaction_date
        return time_diff.total_seconds() <= (self.GOLDEN_HOUR_MINUTES * 60)
    
    def _send_golden_hour_alert(self, complaint: Complaint) -> bool:
        """Send urgent golden hour alert to all relevant authorities"""
        try:
            alert_message = f"""
🚨 GOLDEN HOUR ALERT 🚨

Complaint ID: {complaint.complaint_id}
Amount: ₹{complaint.amount_lost:,.2f}
Fraud Type: {complaint.fraud_type.value}
Time Since Fraud: {(datetime.utcnow() - complaint.transaction_date).seconds // 60} minutes

Accused Account: {complaint.accused_account}
Accused Bank: {complaint.accused_bank}
Transaction ID: {complaint.transaction_id}

⚡ IMMEDIATE ACTION REQUIRED - FREEZE FUNDS NOW ⚡

District: {complaint.district}
Victim Contact: {complaint.victim.phone_number}
            """
            
            # Alert multiple channels simultaneously
            self._send_sms(
                self.AUTHORITIES['CYBER_CELL']['sms_number'],
                f"GOLDEN HOUR: {complaint.complaint_id} - ₹{complaint.amount_lost} - {complaint.accused_bank}"
            )
            
            self._send_email(
                [
                    self.AUTHORITIES['CYBER_CELL']['email'],
                    self.AUTHORITIES['I4C_NATIONAL']['email']
                ],
                "🚨 GOLDEN HOUR - URGENT FRAUD ALERT",
                alert_message,
                priority="high"
            )
            
            # Log activity
            DatabaseManager.add_case_activity(self.db, {
                "complaint_id": complaint.id,
                "action_type": ActionType.BANK_NOTIFIED,
                "description": "Golden hour alert sent to authorities",
                "remarks": "Urgent - Within 1 hour of fraud"
            })
            
            return True
        except Exception as e:
            print(f"Golden hour alert failed: {e}")
            return False
    
    def _send_high_amount_alert(self, complaint: Complaint) -> bool:
        """Alert senior officials for high-value frauds"""
        try:
            alert_message = f"""
HIGH VALUE FRAUD ALERT

Complaint ID: {complaint.complaint_id}
Amount Lost: ₹{complaint.amount_lost:,.2f}
Fraud Type: {complaint.fraud_type.value}

Victim: {complaint.victim.full_name}
District: {complaint.district}
FIR Status: {complaint.fir_number or 'Pending'}

This case requires senior officer attention due to high amount involved.
            """
            
            # Alert DGP office and district SP
            self._send_email(
                [self.AUTHORITIES['DGP_OFFICE']['email']],
                f"High Value Fraud Alert - ₹{complaint.amount_lost:,.0f}",
                alert_message,
                priority="high"
            )
            
            DatabaseManager.add_case_activity(self.db, {
                "complaint_id": complaint.id,
                "action_type": ActionType.COMPLAINT_REGISTERED,
                "description": "High amount alert sent to senior officials",
                "remarks": f"Amount: ₹{complaint.amount_lost:,.2f}"
            })
            
            return True
        except Exception as e:
            print(f"High amount alert failed: {e}")
            return False
    
    def _send_bank_freeze_request(self, complaint: Complaint) -> bool:
        """Send freeze request to accused's bank"""
        try:
            freeze_request = {
                "complaint_id": complaint.complaint_id,
                "account_number": complaint.accused_account,
                "bank_name": complaint.accused_bank,
                "amount": complaint.amount_lost,
                "request_type": "FREEZE",
                "priority": "HIGH" if self._is_golden_hour(complaint) else "NORMAL",
                "requesting_authority": "Odisha Police Cyber Cell",
                "legal_basis": complaint.fir_number or "Under Investigation"
            }
            
            # Create bank action record
            bank_action = DatabaseManager.create_bank_action(self.db, {
                "complaint_id": complaint.id,
                "bank_name": complaint.accused_bank,
                "account_number": complaint.accused_account,
                "action_type": "FREEZE",
                "amount": complaint.amount_lost,
                "status": "PENDING"
            })
            
            # Send to bank nodal officer via email
            bank_email = self._get_bank_nodal_email(complaint.accused_bank)
            self._send_email(
                [bank_email],
                f"URGENT: Account Freeze Request - {complaint.complaint_id}",
                json.dumps(freeze_request, indent=2),
                priority="high"
            )
            
            # Update complaint
            complaint.is_funds_frozen = True
            self.db.commit()
            
            # Send notification to victim
            DatabaseManager.send_notification(self.db, {
                "complaint_id": complaint.id,
                "notification_type": "SMS",
                "recipient": complaint.victim.phone_number,
                "message": f"Your case {complaint.complaint_id}: Bank freeze request sent to {complaint.accused_bank}. You will be updated on the status."
            })
            
            return True
        except Exception as e:
            print(f"Bank freeze request failed: {e}")
            return False
    
    def _sync_with_i4c(self, complaint: Complaint) -> bool:
        """Sync complaint with I4C/CFCFRMS system"""
        try:
            # Prepare data for I4C
            i4c_data = {
                "complaint_id": complaint.complaint_id,
                "state": "ODISHA",
                "district": complaint.district,
                "fraud_type": complaint.fraud_type.value,
                "amount": complaint.amount_lost,
                "transaction_details": {
                    "transaction_id": complaint.transaction_id,
                    "accused_account": complaint.accused_account,
                    "accused_bank": complaint.accused_bank
                },
                "victim_details": {
                    "phone": complaint.victim.phone_number,
                    "district": complaint.district
                },
                "timestamp": complaint.reported_at.isoformat()
            }
            
            # API call to I4C (mock for now)
            # response = requests.post(
            #     self.AUTHORITIES['I4C_NATIONAL']['api_endpoint'],
            #     json=i4c_data,
            #     headers={"Authorization": "Bearer <token>"}
            # )
            
            # For now, log the sync
            DatabaseManager.add_case_activity(self.db, {
                "complaint_id": complaint.id,
                "action_type": ActionType.COMPLAINT_REGISTERED,
                "description": "Case synced with I4C/CFCFRMS",
                "remarks": "National cybercrime database updated"
            })
            
            return True
        except Exception as e:
            print(f"I4C sync failed: {e}")
            return False
    
    def _alert_police_station(self, complaint: Complaint) -> bool:
        """Alert local police station for FIR registration"""
        try:
            station_email = self._get_police_station_email(complaint.district)
            
            alert_message = f"""
NEW CYBER FRAUD COMPLAINT

Complaint ID: {complaint.complaint_id}
District: {complaint.district}
Amount: ₹{complaint.amount_lost:,.2f}
Fraud Type: {complaint.fraud_type.value}

Victim Details:
Name: {complaint.victim.full_name}
Phone: {complaint.victim.phone_number}

Action Required: Register FIR and update in CCTNS system

Case Details: View at https://cyberfraud.odisha.gov.in/case/{complaint.complaint_id}
            """
            
            self._send_email(
                [station_email],
                f"New Cyber Fraud Complaint - {complaint.complaint_id}",
                alert_message
            )
            
            return True
        except Exception as e:
            print(f"Police station alert failed: {e}")
            return False
    
    def _alert_district_cyber_cell(self, complaint: Complaint) -> bool:
        """Alert district-level cyber cell"""
        try:
            cell_email = f"cybercell.{complaint.district.lower()}@police.gov.in"
            
            self._send_email(
                [cell_email, self.AUTHORITIES['CYBER_CELL']['email']],
                f"District Cyber Fraud - {complaint.complaint_id}",
                f"New case registered in {complaint.district}. Amount: ₹{complaint.amount_lost:,.2f}"
            )
            
            return True
        except Exception as e:
            print(f"District cyber cell alert failed: {e}")
            return False
    
    def _detect_pattern(self, complaint: Complaint) -> bool:
        """Detect if this complaint is part of a larger pattern/gang activity"""
        # Check for similar cases in last 7 days
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        similar_cases = self.db.query(Complaint).filter(
            Complaint.accused_account == complaint.accused_account,
            Complaint.created_at >= week_ago,
            Complaint.id != complaint.id
        ).count()
        
        return similar_cases >= 2  # 3 or more cases with same accused account
    
    def _send_pattern_alert(self, complaint: Complaint) -> bool:
        """Alert about detected fraud pattern/organized gang"""
        try:
            alert_message = f"""
⚠️ FRAUD PATTERN DETECTED ⚠️

Multiple complaints detected with similar characteristics:
Accused Account: {complaint.accused_account}
Bank: {complaint.accused_bank}

This may indicate organized fraud gang activity.
Recommend immediate investigation and inter-district coordination.

Latest Complaint: {complaint.complaint_id}
Amount: ₹{complaint.amount_lost:,.2f}
            """
            
            self._send_email(
                [
                    self.AUTHORITIES['CYBER_CELL']['email'],
                    self.AUTHORITIES['DGP_OFFICE']['email'],
                    self.AUTHORITIES['I4C_NATIONAL']['email']
                ],
                "⚠️ Fraud Pattern Detected - Organized Activity Suspected",
                alert_message,
                priority="high"
            )
            
            # Mark as priority case
            complaint.is_priority = True
            self.db.commit()
            
            return True
        except Exception as e:
            print(f"Pattern alert failed: {e}")
            return False
    
    def _send_email(self, recipients: List[str], subject: str, body: str, priority: str = "normal"):
        """Send email notification"""
        try:
            # Configure SMTP (use government mail server)
            # For testing, you can use Gmail or other SMTP
            msg = MIMEMultipart()
            msg['From'] = "cyberfraud@odisha.gov.in"
            msg['To'] = ", ".join(recipients)
            msg['Subject'] = subject
            
            if priority == "high":
                msg['X-Priority'] = '1'
                msg['Importance'] = 'high'
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Mock send for now
            print(f"EMAIL SENT: {subject} to {recipients}")
            
            # Actual SMTP code:
            # server = smtplib.SMTP('smtp.gov.in', 587)
            # server.starttls()
            # server.login("username", "password")
            # server.send_message(msg)
            # server.quit()
            
            return True
        except Exception as e:
            print(f"Email send failed: {e}")
            return False
    
    def _send_sms(self, phone: str, message: str):
        """Send SMS alert"""
        try:
            # Mock SMS for now
            print(f"SMS SENT to {phone}: {message}")
            
            # Actual SMS API call:
            # response = requests.post(
            #     "https://sms.gov.in/api/send",
            #     json={"phone": phone, "message": message}
            # )
            
            return True
        except Exception as e:
            print(f"SMS send failed: {e}")
            return False
    
    def _get_bank_nodal_email(self, bank_name: str) -> str:
        """Get nodal officer email for bank"""
        # Bank nodal officer directory
        bank_contacts = {
            "STATE BANK OF INDIA": "cyberfraud.nodal@sbi.co.in",
            "HDFC BANK": "cybersecurity@hdfcbank.com",
            "ICICI BANK": "cybercell@icicibank.com",
            "AXIS BANK": "fraudmonitoring@axisbank.com",
            "PNB": "cyberfraud@pnb.co.in"
        }
        return bank_contacts.get(bank_name.upper(), "cybersecurity@rbi.org.in")
    
    def _get_police_station_email(self, district: str) -> str:
        """Get police station email for district"""
        return f"ps.{district.lower()}@odisha.gov.in"


# Utility function for manual alerts
def send_manual_alert(db: Session, complaint_id: str, authority_type: str, message: str):
    """
    Send manual alert to specific authority
    authority_type: CYBER_CELL, I4C_NATIONAL, DGP_OFFICE, RBI_NODAL
    """
    alerter = AlertAuthorities(db)
    authority = alerter.AUTHORITIES.get(authority_type)
    
    if not authority:
        return {"error": "Invalid authority type"}
    
    alerter._send_email(
        [authority['email']],
        f"Manual Alert - {complaint_id}",
        message
    )
    
    return {"success": True, "authority": authority_type}