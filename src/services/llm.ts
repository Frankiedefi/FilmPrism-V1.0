import { CohereClient } from 'cohere-ai';

const cohereApiKey = import.meta.env.VITE_COHERE_API_KEY;

if (!cohereApiKey) {
  console.error('Cohere API key is not set. Please check your .env file.');
}

const cohere = new CohereClient({
  token: cohereApiKey,
});

export async function generateDialogue(prompt: string, characters: string[], context: string): Promise<string> {
  const fullPrompt = `Generate a dialogue for the following scene:\n\nCharacters: ${characters.join(', ')}\n\nContext: ${context}\n\nPrompt: ${prompt}`;

  try {
    console.log('Sending request to Cohere API for dialogue generation');
    const response = await cohere.generate({
      model: 'command',
      prompt: fullPrompt,
      max_tokens: 300,
      temperature: 0.7,
    });
    console.log('Received response from Cohere API:', response);

    if (!response.generations || response.generations.length === 0) {
      throw new Error('Empty response from Cohere API');
    }

    return response.generations[0].text || "Sorry, I couldn't generate dialogue at this time.";
  } catch (error) {
    console.error('Error generating dialogue with Cohere:', error);
    return "Failed to generate dialogue. Please try again later.";
  }
}

export async function generateRandomCharacter(storyContext?: string): Promise<{ name: string; bio: string; age: number | null; role: string }> {
  const prompt = storyContext
    ? `Generate a random movie character with a name, age, a brief bio, and their role in the plot, considering the following story context: ${storyContext}. Respond with the character's name on the first line, age on the second line (or "Unknown" if not specified), their bio on the third line, and their role in the plot on the fourth line.`
    : "Generate a random movie character with a name, age, a brief bio, and a potential role in a story. Respond with the character's name on the first line, age on the second line (or 'Unknown' if not specified), their bio on the third line, and a potential role they could play in a story on the fourth line.";

  try {
    console.log('Sending request to Cohere API for random character generation');
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.8,
    });
    console.log('Received response from Cohere API:', response);

    if (!response.generations || response.generations.length === 0) {
      throw new Error('Empty response from Cohere API');
    }

    const content = response.generations[0].text || "";
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 4) {
      throw new Error('Unexpected response format from Cohere API');
    }

    const name = lines[0].trim();
    const age = lines[1].trim() === 'Unknown' ? null : parseInt(lines[1].trim(), 10);
    const bio = lines[2].trim();
    const role = lines[3].trim();

    return { name, bio, age, role };
  } catch (error) {
    console.error('Error generating random character with Cohere:', error);
    if (error instanceof Error) {
      return { name: "Error", bio: `Failed to generate a random character: ${error.message}`, age: null, role: "Error" };
    }
    return { name: "Error", bio: "Failed to generate a random character. Please try again later.", age: null, role: "Error" };
  }
}

export async function generateRandomScene(): Promise<string> {
  const prompt = "Generate a random scene heading for a screenplay. The scene heading should follow the format: INT./EXT. LOCATION - TIME OF DAY";

  try {
    console.log('Sending request to Cohere API for random scene generation');
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      max_tokens: 50,
      temperature: 0.8,
    });
    console.log('Received response from Cohere API:', response);

    if (!response.generations || response.generations.length === 0) {
      throw new Error('Empty response from Cohere API');
    }

    const sceneHeading = response.generations[0].text?.trim() || "";

    if (!sceneHeading.startsWith('INT.') && !sceneHeading.startsWith('EXT.')) {
      throw new Error('Generated scene heading does not start with INT. or EXT.');
    }

    return sceneHeading;
  } catch (error) {
    console.error('Error generating random scene with Cohere:', error);
    if (error instanceof Error) {
      return `Failed to generate a random scene: ${error.message}`;
    }
    return "Failed to generate a random scene. Please try again later.";
  }
}