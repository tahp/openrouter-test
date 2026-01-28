const modelForm = document.getElementById('model-form');
const modelSelect = document.getElementById('model');

// Function to fetch models and populate the dropdown
async function populateModels() {
  try {
    const response = await fetch('/api/index/models');
    const data = await response.json();
    const models = data.data; // OpenRouter API returns models in a 'data' array

    // Clear existing options
    modelSelect.innerHTML = '';

    // Populate with fetched models
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name || model.id; // Use name if available, otherwise id
      modelSelect.appendChild(option);
    });

    // Fetch and set the current model
    const currentModelResponse = await fetch('/api/index/model');
    const currentModelData = await currentModelResponse.json();
    modelSelect.value = currentModelData.model;

  } catch (error) {
    console.error('Error fetching models:', error);
    // Add some default models if fetching fails
    modelSelect.innerHTML = `
      <option value="openai/gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
      <option value="google/gemini-pro">Google Gemini Pro</option>
      <option value="anthropic/claude-2">Anthropic Claude 2</option>
    `;
  }
}

// Call populateModels when the page loads
document.addEventListener('DOMContentLoaded', populateModels);


modelForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const model = modelSelect.value;

  if (!model) {
    alert('Please select a model.');
    return;
  }

  try {
    const response = await fetch('/api/index/model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    });

    if (response.ok) {
      alert('Model updated successfully!');
    } else {
      alert('Error updating model.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error updating model.');
  }
});

const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function addMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  messageElement.innerText = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = chatInput.value;
  chatInput.value = '';

  addMessage(message, 'user');

  try {
    const response = await fetch('/api/index/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      addMessage(data.reply, 'assistant');
    } else {
      addMessage('Error sending message.', 'assistant');
    }
  } catch (error) {
    console.error('Error:', error);
    addMessage('Error sending message.', 'assistant');
  }
});
