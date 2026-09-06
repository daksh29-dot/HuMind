import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI()

# 1. Setup CORS (Allow Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Initialize Clients
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- Data Models ---
class ChatInput(BaseModel):
    transcript_history: str  # The full conversation so far
    user_input: str          # What the user just said
    image_base64: str | None = None # Snapshot (Optional)

class AnalysisInput(BaseModel):
    transcript: str
    user_email: str = "anonymous"  # Default to anonymous if missing
    trust_score: int = 100  # Default trust score
# --- Routes ---

@app.get("/")
def health():
    return {"status": "AI Brain is Online 🧠"}

@app.post("/chat")
def chat_agent(data: ChatInput):
    """
    The Interviewer Agent.
    It sees the image (stress detection) and reads text to generate the next question.
    """
    system_instruction = """
    You are a Senior Tech Recruiter. Conduct a behavioral interview.
    1. Keep responses short (max 2 sentences).
    2. If the user looks stressed (in the image) or confused, be encouraging.
    3. Do NOT ask technical coding questions. Ask about conflict, teamwork, and failure.
    4. Start by asking: "Tell me about a time you failed."
    """
    
    # Prepare content for Gemini (Multimodal)
    contents = [{"text": data.transcript_history + f"\nUser: {data.user_input}"}]
    
    if data.image_base64:
        # Add image if provided
        contents.append({"inline_data": {"mime_type": "image/jpeg", "data": data.image_base64}})

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            config=types.GenerateContentConfig(system_instruction=system_instruction),
            contents=contents
        )
        print(response)
        return {"reply": response.text}
    except Exception as e:
        print(e)
        return {"reply": "I'm having trouble connecting. Let's continue.", "error": str(e)}

@app.post("/analyze")
def analyze_interview(data: AnalysisInput):
    print(f"🔹 Analyzing Transcript ({len(data.transcript)} chars)...")

    # 1. UPGRADED PROMPT: Extract Skills & Calculate 5 Metrics
    prompt = f"""
    You are an expert Tech Recruiter. Analyze this interview transcript.

    TRANSCRIPT:
    "{data.transcript}"

    TASK:
    1. Identify 'detected_skills': A list of hard/soft skills mentioned (e.g. ["Python", "React", "Conflict Resolution"]).
    2. Score (1-10) these 5 Specific Dimensions based on the evidence:
       - Communication: Clarity and structure of speech.
       - Problem_Solving: Ability to handle challenges.
       - Ownership: Taking responsibility.
       - Resilience: Bouncing back from failure.

    OUTPUT JSON:
    {{
      "scores": {{ 
         "communication": <score>, 
         "problem_solving": <score>, 
         "ownership": <score>, 
         "resilience": <score> 
      }},
      "detected_skills": ["Skill1", "Skill2", "Skill3"],
      "summary": "Professional summary..."
    }}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        
        # Robust JSON Parsing
        import re
        match = re.search(r"\{.*\}", response.text, re.DOTALL)
        if not match: raise ValueError("AI failed to generate JSON")
        ai_data = json.loads(match.group(0))
        raw_scores = ai_data.get('scores', {})
        clean_scores = {
            "technical": raw_scores.get('technical', raw_scores.get('Technical', 5)),
            "communication": raw_scores.get('communication', raw_scores.get('Communication', 5)),
            "problem_solving": raw_scores.get('problem_solving', raw_scores.get('Problem_Solving', 5)),
            "ownership": raw_scores.get('ownership', raw_scores.get('Ownership', 5)),
            "resilience": raw_scores.get('resilience', raw_scores.get('Resilience', 5)),
            "skills_list": ai_data.get('detected_skills', [])
        }
        print(f"✅ Skills Detected: {ai_data.get('detected_skills')}")
        print(f"✅ Scores: {ai_data.get('scores')}")

        # Generate Vector
        vector_res = client.models.embed_content(
            model="text-embedding-004",
            contents=ai_data['summary']
        )
        vector = vector_res.embeddings[0].values

        # Save to DB (We store everything inside 'culture_scores' to avoid changing DB schema)
        # We merge scores + skills into one JSON object for storage
        storage_json = ai_data['scores']
        storage_json['skills_list'] = ai_data['detected_skills'] # Store list inside the json

        # Save to DB (Include user_email)
        # Save to DB
        db_res = supabase.table("interviews").insert({
            "transcript": data.transcript,
            "culture_scores": clean_scores,
            "summary": ai_data.get('summary', "No summary."),
            "embedding": vector,
            "user_email": data.user_email,
            "trust_score": data.trust_score # <--- Save it
        }).execute()
        
        return {"status": "Saved", "id": db_res.data[0]['id']}

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Add this to the bottom of main.py ---

class SearchInput(BaseModel):
    query_text: str

@app.post("/search_candidates")
def search_candidates(data: SearchInput):
    try:
        # 1. Get Embedding (FIXED LINE BELOW)
        vector_res = client.models.embed_content(
            model="text-embedding-004",
            contents=data.query_text  # <--- CHANGED 'content' TO 'contents'
        )
        query_vector = vector_res.embeddings[0].values

        # 2. Search DB
        response = supabase.rpc(
            "match_interviews",
            {
                "query_embedding": query_vector,
                "match_threshold": 0.5,
                "match_count": 5
            }
        ).execute()

        return {"matches": response.data}

    except Exception as e:
        print(f"Search Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- GET ALL CANDIDATES ENDPOINT ---
@app.get("/candidates")
def get_all_candidates():
    try:
        # Fetch all rows from 'interviews' table, ordered by newest first
        response = supabase.table("interviews").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching candidates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/my_stats")
def get_my_stats(data: dict):
    email = data.get("email")
    try:
        response = supabase.table("interviews").select("*").eq("user_email", email).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))