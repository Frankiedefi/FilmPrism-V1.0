import { Anthropic } from '@anthropic-ai/sdk';

const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
  dangerouslyAllowBrowser: true,
});

export async function generateWithAnthropic(prompt: string, context: string = ''): Promise<string> {
  try {
    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 1000,
      prompt: `${context}\n\nHuman: ${prompt}\n\nAssistant:`,
    });

    return completion.completion;
  } catch (error) {
    console.error('Error generating with Anthropic:', error);
    throw error;
  }
}
