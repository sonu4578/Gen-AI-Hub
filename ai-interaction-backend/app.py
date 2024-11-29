import openai
import anthropic
import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from openai import OpenAI

# Load the environment variables
load_dotenv()

# Setup the API Keys for OpenAI and Anthropic
openai.api_key = os.getenv('OPENAI_API_KEY')
anthropic.api_key = os.getenv('ANTHROPIC_API_KEY')

app = Flask(__name__)
CORS(app)

#Implementation for the main API used by the UI portal to send questions to the AI models
@app.route('/api/ask', methods=['POST'])
def ask_ai():
    data = request.get_json()

    model = data.get('model')
    system_prompt = data.get('systemPrompt')
    user_input = data.get('userInput')

    # Check for missing or empty fields
    if not model:
        return jsonify({"error": "Model is required"}), 400

    if not user_input:
        return jsonify({"error": "User Input is required"}), 400

    # Validate the length of systemPrompt and userInput
    if system_prompt and len(system_prompt) > 2000:
        return jsonify({"error": "System Prompt exceeds maximum length of 2000 characters"}), 400

    if user_input and len(user_input) > 2000:
        return jsonify({"error": "User Input exceeds maximum length of 2000 characters"}), 400

    #Send the calls to the appropriate API based on the model selected
    if model.startswith("OpenAI"):
        return openai_response(model, system_prompt, user_input)
    elif model.startswith("Anthropic"):
        return anthropic_response(model, system_prompt, user_input)
    else:
        return jsonify({"error": "Invalid model selected"}), 400


#Implementation for calling the OpenAI API
def openai_response(model, system_prompt, user_input):
    try:
        #Create the client
        client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
        )

        model_id = model.split("OpenAI-")[1]

        #Send the prompt to the AI model using an API call
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": system_prompt + "\n" + user_input,
                }
            ],
            model=model_id,
        )

        return jsonify({"response": response.choices[0].message.content})

    except Exception as e:
        # TODO: Need to add logging and error metrics. Fow now, print the error for debugging
        print(f"Error in OpenAI response: {e}")
        return jsonify({"error": "An error occurred while processing the request. Please check the request parameters or contact the administrator if the problem persists."}), 500

#Implementation for calling the Anthropic API
def anthropic_response(model, system_prompt, user_input):
    try:

        #Create a client
        client = anthropic.Client()

        model_id = model.split("Anthropic-")[1]

        #Send the prompt to the AI model using an API call
        response = client.messages.create(
            model=model_id,
            messages=[{"role": "user", "content": system_prompt + "\n" + user_input}],
            max_tokens=150
        )

        return jsonify({"response": response.content[0].text})
    except Exception as e:
        # TODO: Need to add logging and error metrics. Fow now, print the error for debugging
        print(f"Error in Anthropic response: {e}")
        return jsonify({"error": "An error occurred while processing the request. Please check the request parameters or contact the administrator if the problem persists."}), 500


if __name__ == '__main__':
    app.run(debug=True)
