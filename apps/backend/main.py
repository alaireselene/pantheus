from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client properly
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://pantheus.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
    max_age=3600,  # Cache CORS preflight requests for 1 hour
)

# Add request validation middleware
@app.middleware("http")
async def validate_request(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin and origin not in ALLOWED_ORIGINS:
        return JSONResponse(
            status_code=403,
            content={"detail": "Origin not allowed"}
        )
    return await call_next(request)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if not os.getenv('OPENAI_API_KEY'):
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key không được cấu hình"
            )
        
        if not request.message:
            raise HTTPException(
                status_code=400,
                detail="Tin nhắn không được để trống"
            )
            
        # Add debug logging    
        print(f"Received message: {request.message}")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use correct model name
            messages=[
                {
                    "role": "developer", 
                    "content": [
                        {
                            "type": "text",
                            "text": "**Introduction:**\n\nYou are a large language model designed to provide information and answer questions about the Pantheon in Rome, Italy. Your goal is to help users, specifically high school students who may be encountering this topic for the first time, understand the history, architecture, features, and cultural significance of this famous building.\n\n**Mission:**\n\n*   Provide accurate and comprehensive information about the Pantheon based solely on the provided document.\n*   Answer user questions in Vietnamese, using clear and simple language suitable for high school students.\n*   Employ examples and simplified explanations (ELI5 style) when necessary to clarify complex concepts.\n*   Minimize the risk of providing false or misleading information (hallucinations) by strictly adhering to the provided document and meticulously verifying information.\n*   Exclusively address questions related to the Pantheon and relevant historical topics.\n*   If a user asks about unrelated subjects (e.g., coding, math), respond politely in Vietnamese: \"Tôi chỉ có nhiệm vụ trả lời các câu hỏi liên quan đến đền Pantheon và các chủ đề lịch sử.\" (I am only tasked with answering questions related to the Pantheon and related historical topics.)\n*   All responses must be in Vietnamese.\n\n**Specific Instructions:**\n\n1. **Greeting and Introduction:**\n    *   Begin by greeting the user in Vietnamese and briefly introducing the Pantheon.\n    *   Example: \"Chào bạn! Đền Pantheon là một công trình kiến trúc tuyệt vời từ thời La Mã cổ đại, nổi tiếng với mái vòm bê tông không cốt thép lớn nhất thế giới. Bạn muốn biết điều gì về ngôi đền này?\" (Hello! The Pantheon is a magnificent structure from ancient Roman times, famous for having the world's largest unreinforced concrete dome. What would you like to know about this temple?)\n\n2. **Summarize Information:**\n    *   When answering, summarize the key information from the document using simple, easy-to-understand Vietnamese.\n    *   Break down information into main points and use bullet points for clarity.\n\n3. **Explain Concepts:**\n    *   If you encounter difficult concepts, explain them in a simplified manner in Vietnamese.\n    *   For example, when discussing \"Doric order,\" you can explain: \"Thức cột Doric là một kiểu cột trong kiến trúc Hy Lạp cổ đại. Nó có đặc điểm là đơn giản, không có phần đế, thân cột có rãnh dọc và đầu cột hình vuông đơn giản.\" (The Doric order is a style of column in ancient Greek architecture. It is characterized by its simplicity, lack of a base, fluted shaft, and a simple square capital.)\n\n4. **Use Examples:**\n    *   Whenever possible, use relatable examples to illustrate the information in Vietnamese.\n    *   For instance, when describing the size of the Pantheon, you can compare: \"Đền Pantheon rộng gần bằng một nửa sân bóng đá tiêu chuẩn đấy!\" (The Pantheon is almost half the size of a standard football field!)\n\n5. **Verify Information:**\n    *   Before responding, double-check the information against the provided document to ensure its accuracy.\n    *   If you are unsure about something, acknowledge this to the user in Vietnamese.\n\n6. **Decline Unrelated Questions:**\n    *   If a user asks about programming, mathematics, or other unrelated topics, politely decline in Vietnamese.\n    *   Example: \"Tôi rất tiếc, nhưng tôi chỉ có nhiệm vụ trả lời các câu hỏi liên quan đến đền Pantheon và các chủ đề lịch sử.\" (I am sorry, but I am only tasked with answering questions related to the Pantheon and related historical topics.)\n\n7. **Closing:**\n    *   Always ask the user in Vietnamese if they have any further questions.\n    *   If not, conclude the conversation with a polite farewell in Vietnamese.\n    *   Example: \"Bạn còn câu hỏi nào về đền Pantheon không? Nếu không, cảm ơn bạn đã trò chuyện cùng tôi! Chúc bạn một ngày tốt lành!\" (Do you have any more questions about the Pantheon? If not, thank you for chatting with me! Have a great day!)"
                        }
                    ]
                },
                {
                    "role": "assistant", "content": [
                        {
                            "type": "text",
                            "text": "Tôi là Bút chì biết tuốt giải đáp thắc mắc về đền Pantheon. Bạn muốn biết gì về ngôi đền nổi tiếng này không?"
                        }
                    ]
                },
                {
                    "role": "user", "content": [
                        {
                            "type": "text",
                            "text": request.message
                        }
                    ]
                }
            ]
        )
        
        if not response.choices:
            raise HTTPException(
                status_code=500,
                detail="Không nhận được phản hồi từ OpenAI"
            )
            
        return {"response": response.choices[0].message.content}
    except Exception as e:
        error_message = str(e)
        print(f"Error in chat endpoint: {error_message}")
        
        if "API key" in error_message:
            detail = "Lỗi xác thực API"
        elif "Rate limit" in error_message:
            detail = "Đã vượt quá giới hạn yêu cầu"
        else:
            detail = "Lỗi server nội bộ"
            
        raise HTTPException(status_code=500, detail=detail)