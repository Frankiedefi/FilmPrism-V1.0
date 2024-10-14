import React from 'react';

interface CharacterTrackerProps {
  content: string;
  characters: { name: string; bio: string }[];
}

function CharacterTracker({ content, characters }: CharacterTrackerProps) {
  if (!characters || characters.length === 0) {
    return null;
  }

  const characterAppearances = characters.map(character => ({
    name: character.name,
    count: (content.match(new RegExp(`\\b${character.name.toUpperCase()}\\b`, 'g')) || []).length
  }));

  const totalAppearances = characterAppearances.reduce((sum, char) => sum + char.count, 0);

  if (totalAppearances === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Character Appearances</h4>
      <ul>
        {characterAppearances.map((character, index) => (
          <li key={index} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{character.name}</span>
              <span className="text-sm text-gray-600">{character.count} appearances</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${(character.count / totalAppearances) * 100}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterTracker;