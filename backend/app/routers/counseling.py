from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal
import os
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.document_loaders import TextLoader

router = APIRouter()

# Initialize Groq LLM
groq_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(
    temperature=0.7,
    model_name="llama-3.3-70b-versatile",
    groq_api_key=groq_api_key
) if groq_api_key else None

from langchain_text_splitters import RecursiveCharacterTextSplitter

# Initialize VectorStore
try:
    loader = TextLoader(os.path.join(os.path.dirname(__file__), "../docs.txt"), encoding="utf-8")
    raw_docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(raw_docs)
    
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
except Exception as e:
    print(f"Error loading FAISS vectorstore: {e}")
    retriever = None

# In-memory store for session histories
session_store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

system_prompt_template = """
আপনি একজন অত্যন্ত সহানুভূতিশীল এবং অভিজ্ঞ মানসিক স্বাস্থ্য কাউন্সেলর। আপনার উদ্দেশ্য হল রোগীকে মানসিক সহায়তা প্রদান করা। 
নিচের তথ্যগুলোর ওপর ভিত্তি করে রোগীর প্রশ্নের উত্তর দিন এবং সর্বদা সুন্দর ও পরিষ্কার 'বাংলা' ভাষায় (Bengali script) উত্তর দেবেন।
বিঃদ্রঃ: আপনি একজন কাউন্সেলর, তাই কখনো সরাসরি কোনো নির্দিষ্ট ওষুধের নাম খাওয়ার পরামর্শ দেবেন না, বরং ডাক্তারের পরামর্শ নিতে বলবেন। আপনি কেবল ওষুধের ধরন (যেমন PrEP, PEP, বা ART) সম্পর্কে ধারণা দিতে পারেন। 

তথ্য (Context):
{context}
"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt_template),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}"),
    ]
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def generate_rag_response(message: str, user_id: str) -> str:
    if not llm or not retriever:
        return "দুঃখিত, বর্তমানে সিস্টেম আপগ্রেড চলছে। অনুগ্রহ করে 16789 নম্বরে কল করে সহায়তা নিন।"
    
    from operator import itemgetter

    rag_chain = (
        RunnablePassthrough.assign(
            context=(itemgetter("question") | retriever | format_docs)
        )
        | qa_prompt
        | llm
        | StrOutputParser()
    )

    with_message_history = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="history",
    )
    
    return with_message_history.invoke(
        {"question": message}, # Pass message as a dictionary for the 'question' key
        config={"configurable": {"session_id": user_id}}
    )

CRISIS_KEYWORDS = ["die", "suicide", "kill myself", "মরতে চাই", "আত্মহত্যা", "বাঁচতে চাই না"]
DISTRESS_KEYWORDS = ["depressed", "hopeless", "scared", "ashamed", "stigma", "ভয়", "লজ্জা", "হতাশ"]

class CounselingMessage(BaseModel):
    message: str
    user_id: str

def detect_mood(message: str) -> Literal["positive", "distressed", "crisis"]:
    msg_lower = message.lower()
    if any(k in msg_lower for k in CRISIS_KEYWORDS):   return "crisis"
    if any(k in msg_lower for k in DISTRESS_KEYWORDS): return "distressed"
    return "positive"

@router.post("/message")
def send_message(msg: CounselingMessage):
    mood = detect_mood(msg.message)
    response = generate_rag_response(msg.message, msg.user_id)
    return {
        "mood": mood,
        "response": response,
        "escalate_to_human": mood in ["crisis", "distressed"],
        "crisis_hotline": "16789" if mood == "crisis" else None,
    }

@router.get("/adherence-tips")
def adherence_tips():
    return {
        "tips": [
            "প্রতিদিন একই সময়ে আপনার নিয়ম অনুযায়ী ওষুধ গ্রহণ করুন।",
            "প্রতিদিনের রিমাইন্ডার হিসেবে ফোনে একটি অ্যালার্ম সেট করুন।",
            "ওষুধের ট্র্যাক রাখতে ৭ দিনের পিল বক্স ব্যবহার করুন।",
            "কখনই ওষুধ খাওয়া বাদ দেবেন না — এমনকি যদি আপনি সুস্থ বোধ করেন তবুও।",
            "যদি আপনার একটি ডোজ মিস হয়, মনে পড়ার সাথে সাথে এটি গ্রহণ করুন; তবে যদি পরবর্তী ডোজের সময় হয়ে যায়, তবে মিস করা ডোজটি বাদ দিন।",
        ]
    }
