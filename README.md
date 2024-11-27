# Gen AI Hub

This project provides a simple UI interface to ask questions to AI models and view the responses in real time

## Key Features

The home page of the UI portal shows a welcome message and a form to ask questions to AI models

<img src="[https://example.com/path/to/your/image.png](https://github.com/user-attachments/assets/7812f181-9d9a-4de2-9e8e-05a29e5ef1e2)" width="200" height="150">

![image](https://github.com/user-attachments/assets/7812f181-9d9a-4de2-9e8e-05a29e5ef1e2)

After selecting the model and submitting the question, the UI portal calls the backend API to get a response from the selected AI model. 
A rotating circle is shown while the UI is waiting for a response from the API
After the API returns the response from the AI model, the response is shown in the UI page

![image](https://github.com/user-attachments/assets/d9cc175f-aa19-4d1f-b42e-c23abe78ba66)

## Setup Instructions

Clone the repository. This project has two main parts:
   ai-interaction-backend: A Python Flask API that interacts with the APIs from OpenAI and Anthropic 
   ai-interaction-portal: A React UI Portal that shows a simple UI page to submit questions to AI Models and see the responses in real time

### Setup the API service

1. Open a new terminal window and go into the ai-interaction-backend folder

```cd ai-interaction-backend```


2. On MacOS set the virtual environment:
```python3 -m venv venv
source venv/bin/activate
```

4. Install the required dependencies:

```pip install flask openai anthropic
pip install python-dotenv
pip install flask-cors
```

4. Export the environment variables to set the API Keys

```export OPENAI_API_KEY=<Add-API-Key-Here>
export ANTHROPIC_API_KEY=<Add-API-Key-Here>
```

5. Start the application

```python app.py```

### Setup the UI application

1. Open a new terminal window and go into the ai-interaction-portal folder
   ```cd ai-interaction-portal```

2. Install the required dependencies

```npm install axios
npm install bootstrap
npm install marked
npm install react-markdown
npm install marked
npm install markdown-it
npm install --save @testing-library/react @testing-library/jest-dom @testing-library/user-event jest\n
```

3. Start the NodeJS App

```npm start```

4. Go to the Web UI at: http://localhost:3000/

5. Select the AI model from the drop down

6. Enter the System Prompt User Input

7. Click the Submit button to see the real time response from the selected AI Model.


