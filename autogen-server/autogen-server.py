from flask import Flask, request, jsonify
import autogen
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# טוען את ההגדרות מ-OAI_CONFIG_LIST
config_list = autogen.config_list_from_json("OAI_CONFIG_LIST")

# יוצר את ה-Agent באופן קבוע
assistant = autogen.AssistantAgent(
    name="deepseek_assistant",
    llm_config={
        "config_list": config_list,
        "cache_seed": 42,
    }
)

@app.route("/ask-agent", methods=["POST"])
def ask_agent():
    # מקבל את ההודעה מהמשתמש
    data = request.get_json()
    user_message = data.get("message", "")

    # שואל את ה-Agent עם ההודעה של המשתמש
    user = autogen.UserProxyAgent(
        name="user",
        human_input_mode="NEVER",
        code_execution_config=False,
    )

    # מחליף את ההודעה של המשתמש ומבצע שיחה עם ה-Agent
    user.initiate_chat(assistant, message=user_message)

    # מקבל את התשובה מה-Agent ומחזיר אותה
    result = assistant.last_message()["content"]
    return jsonify({"response": result})


if __name__ == "__main__":
    app.run(port=5000)
