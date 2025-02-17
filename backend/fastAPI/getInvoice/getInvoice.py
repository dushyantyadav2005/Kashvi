from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
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
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            'C:/Users/04khu/Desktop/Invoice Integration/backend/fastAPI/getInvoice/credentials.json', SCOPES)
        creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return build('drive', 'v3', credentials=creds)

def generate_invoice(invoice_number, items):
    try:
        pdf_filename = f"Invoice_{invoice_number}.pdf"
        c = canvas.Canvas(pdf_filename, pagesize=letter)
        
        y = 750  # Starting y position
        
        c.setFont("PlayfairDisplay", 24)
        c.drawString(50, y, "Kashvi Creations")
        
        c.setFont("OpenSans", 12)
        y -= 30
        c.drawString(50, y, f"Invoice #: {invoice_number}")
        y -= 20
        c.drawString(50, y, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
        
        y -= 40
        c.setFont("OpenSans-Bold", 12)
        c.drawString(50, y, "Product")
        c.drawString(200, y, "Brand")
        c.drawString(300, y, "Quantity")
        
        y -= 10
        c.line(50, y, 550, y)
        
        c.setFont("OpenSans", 12)
        for item in items:
            y -= 20
            c.drawString(50, y, item['name'])
            c.drawString(200, y, item['brand'])
            c.drawString(300, y, str(item['qty']))
        
        c.save()

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
    
@app.get("/")
def helloWorld():
    return {"message": "Hello World"}

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8003)