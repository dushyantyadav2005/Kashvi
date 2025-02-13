from langchain_community.llms import HuggingFaceHub
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class TagsRequest(BaseModel):
    tags: List[str]
    use_gemini: bool = True

def generate_description(tags, use_gemini=True):
    load_dotenv()
    
    if use_gemini:
        google_api_key = "AIzaSyBqLZBVeS0rSDYKTUkff9WIcnC_aqhBrFs"
        genai.configure(api_key=google_api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Task: Write a professional product description for an Indian traditional saree.
        Context: This is for a legitimate e-commerce website selling traditional Indian clothing.
        
        Using these elements: {', '.join(tags)}
        
        Guidelines:
        - Keep the tone professional and family-friendly
        - Focus on fabric, design, and cultural significance
        - Describe the saree in a respectful, business-appropriate manner
        - Avoid any suggestive or inappropriate language
        - Keep the description within 5-6 sentences
        - Use formal, business-appropriate language
        
        The description should be suitable for a family-friendly e-commerce platform.
        """

        try:
            response = model.generate_content(
                prompt,
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_NONE",
                    }
                ]
            )
            description = response.text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate with Gemini: {str(e)}")
            
    else:
        # Verify HuggingFace token is available and not empty
        huggingface_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
        if not huggingface_token or not huggingface_token.strip():
            raise HTTPException(status_code=500, detail="Please set a valid HUGGINGFACEHUB_API_TOKEN environment variable")

        try:
            llm = HuggingFaceHub(
                repo_id="google/flan-t5-base",
                model_kwargs={"temperature": 0.7, "max_length": 512}
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to initialize HuggingFaceHub: {str(e)}. Please verify your API token is valid.")

        template = """Given these tags: {tags}
        Write a 10-line creative description that incorporates these elements.
        The description should be engaging and coherent.
        """

        prompt = PromptTemplate(
            input_variables=["tags"],
            template=template
        )

        final_prompt = prompt.format(tags=", ".join(tags))
        description = llm(final_prompt)

    lines = description.strip().split('\n')
    if len(lines) > 10:
        lines = lines[:10]
    elif len(lines) < 10:
        lines.extend([""] * (10 - len(lines)))

    des = "\n".join(lines)
    print(des)

    return des

@app.post("/generate-description")
async def generate_description_endpoint(request: TagsRequest):
    try:
        tags = request.tags
        use_gemini = request.use_gemini
        
        # Debug logging
        print(f"Received tags: {tags}")
        print(f"Use Gemini: {use_gemini}")
        
        if not tags or not isinstance(tags, list):
            raise HTTPException(status_code=400, detail="Tags must be provided as a non-empty list")
            
        description = generate_description(tags, use_gemini)
        return {"description": description}
    except Exception as e:
        # Detailed error logging
        import traceback
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
