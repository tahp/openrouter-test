import { OpenRouter } from '@openrouter/sdk';
import fetch from 'node-fetch';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function chat(messages, model) {
  try {
    const stream = await openRouter.chat.send({
      model,
      messages,
      stream: true,
      max_tokens: 4096, // Set a safe max_tokens value
    });

    let assistantReply = '';

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) {
        assistantReply += token;
      }
    }
    return assistantReply;
  } catch (err) {
    console.error('\nError:', err.message, '\n');
    return 'An error occurred.';
  }
}
