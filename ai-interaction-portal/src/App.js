import React, { useState } from 'react';
import './App.css';

/*Implementation of the request handler for a simple web page that shows
  a form to submit questions to Open AI or Anthropic models
*/
function App() {
  const [formData, setFormData] = useState({
    model: '',
    systemPrompt: '',
    userInput: '',
  });

  const [responseText, setResponseText] = useState('<h1 align="center">Welcome to the Gen AI Hub!</h1><br/><p align="center">Please use the form below to ask a question.</p>');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.userInput) newErrors.userInput = 'User Input is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*Handle the submission of the form to ask questions to AI Models*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {

      /*Call the API for asking questions to AI Models*/
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: formData.model,
          systemPrompt: formData.systemPrompt,
          userInput: formData.userInput,
        }),
      });

      /*Process the response from the AI model*/
      const data = await response.json();
      if (data.response) {
        setResponseText(data.response);
      } else {
        setResponseText('An error occurred while processing the request. Please check the request parameters or contact the administrator if the problem persists.');
      }
    } catch (error) {
      setResponseText('Error fetching data from API');
    } finally {
      setLoading(false);
    }
  };

  /*Process the formatting annotations in the text response from AI Models*/
  const renderMarkdown = (markdown) => {
      const mdToHtml = (str) => {
        const html = str
          .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
          .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
          .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
          .replace(/\n/g, '<br/>');
        return html;
      };

      return <div dangerouslySetInnerHTML={{ __html: mdToHtml(markdown) }} />;
  };

  return (
    <div className="App">
      <div className="navbar">
        <h3>Gen AI Hub</h3>
      </div>
      <div className="response-text">
        {loading ? (
          <div></div>
        ) : (
          responseText && renderMarkdown(responseText)
        )}
      </div>

      <form onSubmit={handleSubmit} className="search-form-wrapper">
        <div className="search-form">
            <div className="form-element-drop-down">
              <label htmlFor="model">
                Model <span className="required">*</span>
              </label>
              <select
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              >
                <option value="Not-selected">Please select a model</option>
                <option value="OpenAI-gpt-4">OpenAI-gpt-4</option>
                <option value="OpenAI-gpt-3.5-turbo">OpenAI-gpt-3.5-turbo</option>
                <option value="Anthropic-claude-3-opus-latest">Anthropic-claude-3-opus-latest</option>
                <option value="Anthropic-claude-3-sonnet-20240229">Anthropic-claude-3-sonnet-20240229</option>
                <option value="Anthropic-claude-3-5-haiku-latest">Anthropic-claude-3-5-haiku-latest</option>
                <option value="Anthropic-claude-3-5-sonnet-latest">Anthropic-claude-3-5-sonnet-latest</option>
              </select>
              {errors.model && <p className="error">{errors.model}</p>}
            </div>

            <div className="form-element">
              <label htmlFor="systemPrompt">System Prompt</label>
              <textarea
                id="systemPrompt"
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                maxLength={2000}
              />
            </div>

            <div className="form-element">
              <label htmlFor="userInput">
                User Input <span className="required">*</span>
              </label>
              <textarea
                id="userInput"
                name="userInput"
                value={formData.userInput}
                onChange={handleChange}
                maxLength={2000}
                required
              />
              {errors.userInput && <p className="error">{errors.userInput}</p>}
            </div>
        </div>

        <button type="submit">Submit</button>

      </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

      <footer className="footer">
        <p>© 2024 Gen AI Hub</p>
      </footer>
    </div>
  );
}

export default App;
