import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { chat } from '../llm.js';

const app = express();

let currentModel = 'openai/gpt-3.5-turbo';
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
];

app.use(bodyParser.json());

// API routes (these will live under /api/* automatically)
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

app.get('/models', async (req, res) => {
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

  try {
    messages.push({ role: 'user', content: message });
    const reply = await chat(messages, currentModel);
    messages.push({ role: 'assistant', content: reply });
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'LLM failed' });
  }
});

export default app;
