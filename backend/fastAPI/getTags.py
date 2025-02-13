from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from PIL import Image
import io
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


genai.configure(api_key="AIzaSyBqLZBVeS0rSDYKTUkff9WIcnC_aqhBrFs")
model = genai.GenerativeModel('gemini-1.5-flash') 

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
       
        print(f"Received file: {file.filename}, content-type: {file.content_type}")
        
        image_content = await file.read()
        image = Image.open(io.BytesIO(image_content))
        
        print(f"Image size: {image.size}, mode: {image.mode}")
        
        response = model.generate_content([
            "Extract relevant tags for this saree image. Focus on: colors, patterns, fabric, occasion. Return only comma-separated tags.",
            image
        ])
        
        print(f"Gemini response: {response.text}")
        
        tags = [tag.strip() for tag in response.text.split(',')]
        return {"tags": tags}
        
    except Exception as e:
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
