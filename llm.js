import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function chat(messages, model) {
  try {
    const result = await openRouter.chat.send({
      model,
      messages,
      max_tokens: 4096,
    });

    const content =
      result.choices?.[0]?.message?.content ||
      result.choices?.[0]?.text ||
      '';

    return content;
  } catch (err) {
    console.error('LLM error:', err);
    throw err; // let the API route return 500 properly
  }
}
