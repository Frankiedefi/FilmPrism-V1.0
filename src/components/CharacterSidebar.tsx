import React, { useState } from 'react';
import { Plus, User, ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import { generateRandomCharacter } from '../services/llm';

interface Character {
  name: string;
  bio: string;
}

interface StoryContext {
  genre: string;
  setting: string;
  mainCharacter: string;
  conflict: string;
  theme: string;
}

interface CharacterSidebarProps {
  characters: Character[];
  onAddCharacter: (character: Character) => void;
  onUpdateCharacter: (index: number, character: Character) => void;
  onRemoveCharacter: (index: number) => void;
  storyContext: StoryContext | null;
}

function CharacterSidebar({ characters, onAddCharacter, onUpdateCharacter, onRemoveCharacter, storyContext }: CharacterSidebarProps) {
  const [newCharacterName, setNewCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [useStoryContext, setUseStoryContext] = useState(true);

  const handleAddCharacter = () => {
    if (newCharacterName.trim()) {
      onAddCharacter({ name: newCharacterName.trim(), bio: '' });
      setNewCharacterName('');
    }
  };

  const handleGenerateRandomCharacter = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const context = useStoryContext && storyContext
        ? `Story Context: Genre: ${storyContext.genre}, Setting: ${storyContext.setting}, Main Character: ${storyContext.mainCharacter}, Conflict: ${storyContext.conflict}, Theme: ${storyContext.theme}`
        : undefined;
      const randomCharacter = await generateRandomCharacter(context);
      if (randomCharacter.name === "Error") {
        setError(randomCharacter.bio);
      } else {
        const { name, bio } = randomCharacter;
        const prefixedName = useStoryContext && storyContext ? `[SC] ${name}` : name;
        onAddCharacter({ name: prefixedName, bio });
      }
    } catch (error) {
      console.error('Error generating random character:', error);
      setError('Failed to generate a random character. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditCharacter = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, updatedCharacter: Character) => {
    onUpdateCharacter(index, updatedCharacter);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const toggleCardExpansion = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Characters</h3>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      {isExpanded && (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              placeholder="New character name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex mt-2">
              <button
                onClick={handleAddCharacter}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 mr-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
              <button
                onClick={handleGenerateRandomCharacter}
                disabled={isGenerating}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                <User className="h-4 w-4 mr-1" />
                {isGenerating ? 'Generating...' : 'Generate Random'}
              </button>
            </div>
            {storyContext && (
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useStoryContext}
                    onChange={() => setUseStoryContext(!useStoryContext)}
                    className="mr-2"
                  />
                  <span className="text-sm">Use Story Context</span>
                </label>
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <ul>
            {characters.map((character, index) => (
              <li key={index} className="mb-4 p-3 border border-gray-200 rounded-md">
                {editingIndex === index ? (
                  <CharacterEditForm
                    character={character}
                    onSave={(updatedCharacter) => handleSaveEdit(index, updatedCharacter)}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-semibold">{character.name}</span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleEditCharacter(index)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRemoveCharacter(index)}
                          className="text-red-600 hover:text-red-800 mr-2"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleCardExpansion(index)}>
                          {expandedCards.includes(index) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {expandedCards.includes(index) && character.bio && (
                      <p className="text-sm text-gray-600 ml-6 mt-2">{character.bio}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

interface CharacterEditFormProps {
  character: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

function CharacterEditForm({ character, onSave, onCancel }: CharacterEditFormProps) {
  const [name, setName] = useState(character.name);
  const [bio, setBio] = useState(character.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      bio,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Character name"
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Character bio"
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        rows={3}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-gray-600 hover:text-gray-800 mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default CharacterSidebar;