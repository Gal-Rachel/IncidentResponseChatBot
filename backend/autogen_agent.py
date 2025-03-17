import autogen
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


# AutoGen
bot = autogen.AssistantAgent(
    name="ChatBot",
    system_message="You are a helpful assistant. Answer user queries concisely.",
)

app = FastAPI()

class UserMessage(BaseModel):
    text: str

@app.post("/chat")
async def chat_with_bot(user_input: UserMessage):
    try:
        response = bot.generate_reply(user_input.text)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

