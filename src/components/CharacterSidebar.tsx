import React, { useState, useEffect } from 'react';
import { generateWithContext } from '../services/ragService';
import { useLLM } from '../contexts/LLMContext';

interface CharacterSidebarProps {
  projectId: number;
}

const CharacterSidebar: React.FC<CharacterSidebarProps> = ({ projectId }) => {
  const { selectedLLM } = useLLM();
  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const prompt = 'Generate a list of main characters for the project';
        const context = {
          characters: [],
          scenes: [],
          plotPoints: [],
        };
        const characterList = await generateWithContext(prompt, context, selectedLLM === 'anthropic');
        setCharacters(characterList.split(',').map(char => char.trim()));
      } catch (error) {
        console.error('Error generating characters:', error);
      }
    };

    fetchCharacters();
  }, [selectedLLM, projectId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">Characters</h3>
      <ul>
        {characters.map((character, index) => (
          <li key={index} className="mb-1">
            {character}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterSidebar;
