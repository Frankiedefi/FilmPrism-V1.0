import Cohere from 'cohere-ai';

const cohereApiKey = import.meta.env.VITE_COHERE_API_KEY;

if (!cohereApiKey) {
  console.error('Cohere API key is not set. Please check your .env file.');
} else {
  Cohere.init(cohereApiKey);
}

export async function generateWithCohere(prompt: string, context: string = ''): Promise<string> {
  try {
    const response = await Cohere.generate({
      model: 'command-xlarge-nightly',
      prompt: `${context}\n\nHuman: ${prompt}\n\nAssistant:`,
      max_tokens: 1000,
      temperature: 0.7,
      k: 0,
      p: 0.75,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: ["Human:", "Assistant:"],
    });

    return response.body.generations[0].text;
  } catch (error) {
    console.error('Error generating with Cohere:', error);
    throw error;
  }
}
