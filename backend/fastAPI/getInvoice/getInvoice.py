from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from datetime import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os.path
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from fastapi import FastAPI, Request, HTTPException
import random
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))
fonts_dir = os.path.join(current_dir, 'fonts')

# Register fonts with correct paths
pdfmetrics.registerFont(TTFont('PlayfairDisplay', os.path.join(fonts_dir, 'PlayfairDisplay.ttf')))
pdfmetrics.registerFont(TTFont('OpenSans', os.path.join(fonts_dir, 'OpenSans.ttf')))
pdfmetrics.registerFont(TTFont('OpenSans-Bold', os.path.join(fonts_dir, 'OpenSans-Bold.ttf')))

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_google_drive_service():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            'credentials.json', SCOPES)
        creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return build('drive', 'v3', credentials=creds)

def generate_invoice(invoice_number, items):
    try:
        # Create a new PDF with the given filename
        pdf_filename = f"Invoice_{invoice_number}.pdf"
        c = canvas.Canvas(pdf_filename, pagesize=letter)
        
        # Set up initial coordinates
        y = 750  # Starting y position
        
        # Add company header
        c.setFont("PlayfairDisplay", 24)
        c.drawString(50, y, "Kashvi Creations")
        
        # Add invoice details
        c.setFont("OpenSans", 12)
        y -= 30
        c.drawString(50, y, f"Invoice #: {invoice_number}")
        y -= 20
        c.drawString(50, y, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
        
        # Add items header
        y -= 40
        c.setFont("OpenSans-Bold", 12)
        c.drawString(50, y, "Product")
        c.drawString(200, y, "Brand")
        c.drawString(300, y, "Quantity")
        c.drawString(400, y, "Price")
        c.drawString(500, y, "Total")
        
        # Add line under headers
        y -= 10
        c.line(50, y, 550, y)
        
        # Add items
        total_amount = 0
        c.setFont("OpenSans", 12)
        for item in items:
            y -= 20
            item_total = item['qty'] * item['price']
            total_amount += item_total
            
            c.drawString(50, y, item['name'])
            c.drawString(200, y, item['brand'])
            c.drawString(300, y, str(item['qty']))
            c.drawString(400, y, f"${item['price']}")
            c.drawString(500, y, f"${item_total}")
        
        # Add total amount
        y -= 30
        c.line(50, y, 550, y)
        y -= 20
        c.setFont("OpenSans-Bold", 12)
        c.drawString(400, y, "Total Amount:")
        c.drawString(500, y, f"${total_amount}")
        
        # Save the PDF
        c.save()

        # Upload to Google Drive
        service = get_google_drive_service()
        file_metadata = {'name': pdf_filename}
        media = MediaFileUpload(pdf_filename, mimetype='application/pdf')
        file = service.files().create(body=file_metadata,
                                    media_body=media,
                                    fields='id').execute()
        print(f'File ID: {file.get("id")}')
        print(f'PDF has been uploaded to Google Drive: {pdf_filename}')
        return True
    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return False

@app.post("/getinvoice")
async def create_invoice(request: Request):
    try:
        data = await request.json()
        if not data or 'items' not in data:
            raise HTTPException(status_code=400, detail="Invalid request data")
            
        invoice_number = f"{random.randint(1000,9999)}"
        success = generate_invoice(invoice_number, data['items'])
        
        if success:
            return {"message": "Invoice generated and uploaded successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to generate invoice")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add CORS middleware BEFORE any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specifically allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000) 
