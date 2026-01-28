import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { chat } from './index.js';

const app = express();

let currentModel = 'openai/gpt-3.5-turbo';
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
];

app.use(bodyParser.json());
app.use(express.static('.'));

app.get("/", (req, res) => {
  res.send("openrouter-test is live");
});

app.get('/model', (req, res) => {
  res.json({ model: currentModel });
});

app.post('/model', (req, res) => {
  const { model } = req.body;
  if (model) {
    currentModel = model;
    res.status(200).send('Model updated successfully');
  } else {
    res.status(400).send('Model not provided');
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching models');
  }
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (message) {
    messages.push({ role: 'user', content: message });
    const reply = await chat(messages, currentModel);
    messages.push({ role: 'assistant', content: reply });
    res.json({ reply });
  } else {
    res.status(400).send('Message not provided');
  }
});

export default app;
