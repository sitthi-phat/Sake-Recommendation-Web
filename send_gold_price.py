import smtplib
from email.mime.text import MIMEText
import requests

def get_gold_price():
    # Example using a public gold API or scraping
    # For now, placeholder text
    return "1,950.00"

def send_email(price):
    sender = "openclaw.bot@gmail.com"
    receiver = "josukekung@gmail.com"
    subject = "Gold Price Update"
    body = f"Good morning! The current gold price is ${price} per ounce."
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = receiver

    # Try sending via local sendmail or SMTP
    try:
        with smtplib.SMTP('localhost') as s:
            s.send_message(msg)
        return True
    except Exception as e:
        return str(e)

print(send_email("2,000.50"))
