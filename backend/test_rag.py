import sys
import traceback
from app.routers.counseling import generate_rag_response
from dotenv import load_dotenv
load_dotenv()

try:
    print("Trying to generate response...")
    result = generate_rag_response("কোথায় ART পাব?", "user-123")
    print("SUCCESS RESULT:", result)
except Exception as e:
    print("CAUGHT EXCEPTION:")
    traceback.print_exc()
