import sys
from app.routers.counseling import generate_rag_response, session_store
import dotenv
dotenv.load_dotenv()

print("Turn 1:", generate_rag_response("হ্যালো, আমি একজন ডেঙ্গু রোগী", "user1"))
print("History:", session_store["user1"].messages if "user1" in session_store else "None")

print("\nTurn 2:", generate_rag_response("আমি কি প্যারাসিটামল খাব?", "user1"))
print("History:", session_store["user1"].messages if "user1" in session_store else "None")

print("\nTurn 3:", generate_rag_response("আমি কি এসপিরিন খেতে পারি?", "user1"))
print("History:", session_store["user1"].messages if "user1" in session_store else "None")

