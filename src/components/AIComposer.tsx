import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { generateDialogue } from '../services/llm';

interface AIComposerProps {
  scriptContent: string;
  characters: { name: string; bio: string }[];
  scenes: string[];
  onInsertDialogue: (dialogue: string) => void;
  selectedLLM: string;
  storyCard: { title: string; tone: string; beat: string; atmosphere: string; plotContext: string } | null;
}

function AIComposer({ scriptContent, characters, scenes, onInsertDialogue, selectedLLM, storyCard }: AIComposerProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedDialogue, setGeneratedDialogue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedScene, setSelectedScene] = useState('');
  const [useStoryCard, setUseStoryCard] = useState(false);

  const handleGenerateDialogue = async () => {
    setIsLoading(true);
    try {
      let context = selectedScene + '\n\n' + scriptContent.slice(-500); // Use the selected scene and last 500 characters as context
      if (useStoryCard && storyCard) {
        context += `\n\nStory Context:\nTitle: ${storyCard.title}\nTone: ${storyCard.tone}\nBeat: ${storyCard.beat}\nAtmosphere: ${storyCard.atmosphere}\nPlot Context: ${storyCard.plotContext}`;
      }
      const result = await generateDialogue(prompt, selectedCharacters, context);
      setGeneratedDialogue(result);
    } catch (error) {
      console.error('Error generating dialogue:', error);
      setGeneratedDialogue('An error occurred while generating dialogue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterSelect = (characterName: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterName)
        ? prev.filter(name => name !== characterName)
        : [...prev, characterName]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">AI Dialogue Composer</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Characters:</label>
        <div className="flex flex-wrap gap-2">
          {characters.map((character, index) => (
            <button
              key={index}
              onClick={() => handleCharacterSelect(character.name)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCharacters.includes(character.name)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {character.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="scene-select" className="block text-sm font-medium text-gray-700 mb-2">Select Scene:</label>
        <select
          id="scene-select"
          value={selectedScene}
          onChange={(e) => setSelectedScene(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a scene</option>
          {scenes.map((scene, index) => (
            <option key={index} value={scene}>{scene}</option>
          ))}
        </select>
      </div>

      {storyCard && (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useStoryCard}
              onChange={() => setUseStoryCard(!useStoryCard)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Use Story Card: {storyCard.title}</span>
          </label>
        </div>
      )}

      <textarea
        className="w-full h-32 p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the dialogue you want to generate..."
      />
      <button
        onClick={handleGenerateDialogue}
        disabled={isLoading || selectedCharacters.length === 0 || !selectedScene}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 mb-4 disabled:opacity-50"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        {isLoading ? 'Generating...' : 'Generate Dialogue'}
      </button>
      {generatedDialogue && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Generated Dialogue:</h4>
          <pre className="bg-gray-100 p-2 rounded-md whitespace-pre-wrap">{generatedDialogue}</pre>
          <button
            onClick={() => onInsertDialogue(generatedDialogue)}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Insert into Script
          </button>
        </div>
      )}
    </div>
  );
}

export default AIComposer;