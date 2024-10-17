import { generateWithAnthropic } from './anthropic';
import { generateWithCohere } from './cohere';

interface ScriptContext {
  characters: string[];
  scenes: string[];
  plotPoints: string[];
}

export async function generateWithContext(prompt: string, context: ScriptContext, useAnthropic: boolean = true): Promise<string> {
  const contextString = JSON.stringify(context);
  const fullPrompt = `Given the following script context:\n${contextString}\n\nUser prompt: ${prompt}\n\nResponse:`;
  
  try {
    if (useAnthropic) {
      return await generateWithAnthropic(fullPrompt, '');
    } else {
      return await generateWithCohere(fullPrompt, '');
    }
  } catch (error) {
    console.error('Error generating with context:', error);
    throw error;
  }
}

export function updateContext(currentContext: ScriptContext, newData: Partial<ScriptContext>): ScriptContext {
  return {
    ...currentContext,
    ...newData,
  };
}
